import { Server, Socket } from 'socket.io';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources'; // ✅ Correct import
import { orderHandler } from './orderHandler';

// ✅ Define System Prompt for AI
const systemPrompt = `
You are a logistics chatbot. Your job is to help users with their requests by understanding their intent and collecting required information.
Users may ask multiple questions in the same session, so always be prepared to continue the conversation.

Here are the intents and required parameters:
1. Track delivery:
   - Required: trackingNumber
2. Check order status:
   - Required: orderID or trackingNumber
3. Update delivery details:
   - Required: orderID, newAddress
4. General inquiry:
   - No parameters required.

If the user provides all required details, respond with the relevant answer but continue assisting them with follow-up questions.

Respond in this JSON format:
{
  "intent": "extracted intent",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "missingParameters": ["paramName1", "paramName2"],
  "followUpMessage": "Your answer here. You can also ask me anything else!"
}
`;

interface ChatProps {
  name: string;
  time: string;
  message: string;
  sentByAdmin: boolean;
}

interface AIResponse {
  intent: string;
  parameters: Record<string, string>;
  missingParameters: string[];
  followUpMessage: string;
}

interface UserSession {
  messages: ChatCompletionMessageParam[];
  parameters: Record<string, string>;
  missingParameters: string[];
}

export const handleChats = (io: Server): void => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const userSessions: Map<string, UserSession> = new Map();

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    setTimeout(() => {
      socket.emit(
        'response',
        generateChatResponse('Hello! How can I help you?')
      );
    }, 2000);

    socket.on('message', async (msg: string) => {
      console.log(`User (${socket.id}) message:`, msg);

      let userSession = userSessions.get(socket.id) ?? {
        messages: [],
        parameters: {},
        missingParameters: [],
      };

      userSession.messages.push({
        role: 'user',
        content: msg,
      } as ChatCompletionMessageParam);

      try {
        const messages: ChatCompletionMessageParam[] = [
          { role: 'system', content: systemPrompt },
          ...userSession.messages,
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
        });

        if (!completion.choices || completion.choices.length === 0) {
          throw new Error('No response from OpenAI.');
        }

        let parsedContent: AIResponse;
        try {
          parsedContent = JSON.parse(
            completion.choices[0]?.message?.content || '{}'
          ) as AIResponse;
        } catch (error) {
          console.error('Error parsing AI response:', error);
          socket.emit(
            'response',
            generateChatResponse('There was an error processing your request.')
          );
          return;
        }

        if (parsedContent.missingParameters.length > 0) {
          userSession.missingParameters = parsedContent.missingParameters;
        }

        userSession.parameters = {
          ...userSession.parameters,
          ...parsedContent.parameters,
        };

        userSession.missingParameters = userSession.missingParameters.filter(
          (param) => !(param in userSession.parameters)
        );

        userSessions.set(socket.id, userSession);

        let responseMessage = parsedContent.followUpMessage;

        if (userSession.missingParameters.length === 0) {
          responseMessage += ' Feel free to ask me anything else!';
        }

        switch (parsedContent.intent) {
          case 'Track delivery':
            const trackingNumber = userSession.parameters.trackingNumber;
            orderHandler(trackingNumber, io);

            break;

          default:
            socket.emit('response', generateChatResponse(responseMessage));
            break;
        }
      } catch (error) {
        console.error('Error processing OpenAI request:', error);
        socket.emit(
          'response',
          generateChatResponse(
            'An error occurred while processing your request.'
          )
        );
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      userSessions.delete(socket.id);
    });
  });
};

export const generateChatResponse = (
  message: string
): { message: ChatProps } => ({
  message: {
    message,
    name: 'Andy', // Chatbot name
    sentByAdmin: true,
    time: new Date().toISOString(),
  },
});
