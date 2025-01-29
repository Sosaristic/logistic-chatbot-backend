import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import { createChatBodySchema } from '../validators/chat.validator';

import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../app';

// Initialize OpenAI client

// Session state to keep track of users' conversation context
interface SessionState {
  intent: string | null;
  parameters: Record<string, string>;
  missingParameters: string[];
}

const sessionState: Record<string, SessionState> = {};

const systemPrompt = `
You are a logistics chatbot. Your job is to help users with their requests by understanding their intent and collecting required information. 
If the user doesn't provide all necessary parameters, politely ask them for the missing ones.

Here are the intents and required parameters:
1. Track delivery:
   - Required: trackingNumber
2. Check order status:
   - Required: orderID or trackingNumber
3. Update delivery details:
   - Required: orderID, newAddress
4. General inquiry:
   - No parameters required.

Respond with JSON in this format:
{
  "intent": "extracted intent",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "missingParameters": ["paramName1", "paramName2"], // List of missing parameters
  "followUpMessage": "Message to ask user for missing parameters" // Optional message to continue the conversation
}
`;

export const handleChats = asyncHandler(async (req: Request, res: Response) => {
  const { message } = createChatBodySchema.parse(req.body); // Validate incoming message

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  });

  console.log(completion.choices, 'completion');
  console.log(completion.choices[0].message.content, 'message');

  const parsedContent = JSON.parse(completion.choices[0].message.content);
  console.log(parsedContent, 'parsedContent');
  if (parsedContent.intent === 'General inquiry') {
    return sendResponse(
      res,
      200,
      parsedContent.followUpMessage,
      'Chat Response',
      null
    );
  }

  if (parsedContent.intent === 'Track delivery') {
    const trackingNumber = parsedContent.parameters.trackingNumber;
    sendResponse(
      res,
      200,
      `Your order with tracking number ${trackingNumber} is in transit.`,
      'Chat Response',
      null
    );
    return;
  }

  sendResponse(res, 200, message, 'Chat Response', null);
});
