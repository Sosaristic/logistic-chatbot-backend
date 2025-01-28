import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendResponse } from '../utils/sendResponse';
import { createChatBodySchema } from '../validators/chat.validator';

import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: '',
});

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

  const completion = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  });

  completion.then((result) => console.log(result.choices[0].message));

  sendResponse(res, 200, message, 'Chat Response', null);
  return;

  // Retrieve or generate user ID (to handle users who don't log in)
  let userId = req.cookies.userId;
  if (!userId) {
    userId = uuidv4(); // Generate a unique ID if not available
    res.cookie('userId', userId, { maxAge: 86400000, httpOnly: true }); // Cookie expires in 1 day
  }

  // Initialize session state for the user if not already present
  if (!sessionState[userId]) {
    sessionState[userId] = {
      intent: null,
      parameters: {},
      missingParameters: [],
    };
  }

  // Check if we have missing parameters from the previous conversation
  if (sessionState[userId].missingParameters.length > 0) {
    // If there are missing parameters, ask the user to provide them
    const nextParam = sessionState[userId].missingParameters[0];
    sessionState[userId].parameters[nextParam] = message; // Capture the message as the next parameter
    sessionState[userId].missingParameters.shift(); // Remove the parameter after receiving it

    if (sessionState[userId].missingParameters.length === 0) {
      // If no more parameters are missing, process the intent
      const responseMessage = await processIntent(
        sessionState[userId].intent!,
        sessionState[userId].parameters
      );
      sessionState[userId] = {
        intent: null,
        parameters: {},
        missingParameters: [],
      }; // Reset the session state after processing

      return sendResponse(res, 200, responseMessage, 'Chat Response', null);
    } else {
      // If parameters are still missing, prompt for the next one
      const missingParam = sessionState[userId].missingParameters[0];
      return sendResponse(
        res,
        200,
        `Please provide your ${missingParam}.`,
        'Chat Response',
        null
      );
    }
  }

  try {
    // Send the user's message to OpenAI for processing
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // Parse the response from OpenAI
    const { intent, parameters, missingParameters, followUpMessage } =
      JSON.parse(aiResponse.choices[0].message.content);

    // Store the intent, parameters, and missing parameters for the user
    sessionState[userId].intent = intent;
    sessionState[userId].parameters = parameters;
    sessionState[userId].missingParameters = missingParameters;

    // If parameters are missing, ask for the first one
    if (missingParameters.length > 0) {
      return sendResponse(
        res,
        200,
        followUpMessage || `Can you provide your ${missingParameters[0]}?`,
        'Chat Response',
        null
      );
    }

    // If all parameters are present, process the intent and return the response
    const responseMessage = await processIntent(intent, parameters);
    sessionState[userId] = {
      intent: null,
      parameters: {},
      missingParameters: [],
    }; // Reset session state after processing

    return sendResponse(res, 200, responseMessage, 'Chat Response', null);
  } catch (error) {
    console.error('Error handling chat:', error);
    return sendResponse(
      res,
      500,
      'Something went wrong. Please try again.',
      'Error',
      null
    );
  }
});

// Helper function to process the intent and parameters
const processIntent = async (
  intent: string,
  parameters: Record<string, string>
): Promise<string> => {
  if (intent === 'track_order') {
    const trackingNumber = parameters['trackingNumber'];
    // Simulating a database query or processing logic here
    // In a real application, you might query a database to get the tracking information
    return `Your order with tracking number ${trackingNumber} is in transit.`;
  }

  // Default response if the intent doesn't match any known ones
  return 'I am not sure how to process that request. Can you clarify?';
};
