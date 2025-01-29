import { Server } from 'socket.io';
import OpenAI from 'openai';
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

type ChatProps = {
  name: string;
  time: string;
  message: string;
  sentByAdmin: boolean;
};

export const handleChats = (io: Server) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', async (msg) => {
      console.log('Received message:', msg);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        store: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: msg },
        ],
      });

      console.log(completion.choices, 'completion');
      console.log(completion.choices[0].message.content, 'message');

      const parsedContent = JSON.parse(completion.choices[0].message.content);

      switch (parsedContent.intent) {
        case 'General inquiry':
          io.emit('response', {
            message: {
              message: parsedContent.followUpMessage,
              name: 'Andy',
              sentByAdmin: true,
              time: new Date().toISOString(),
            } as ChatProps,
          });

          break;

        case 'Track delivery':
          io.emit('response', {
            message: {
              message: parsedContent.followUpMessage,
              name: 'Andy',
              sentByAdmin: true,
              time: new Date().toISOString(),
            } as ChatProps,
          });
          break;

        case 'Check order status':
          io.emit('response', {
            message: {
              message: parsedContent.followUpMessage,
              name: 'Andy',
              sentByAdmin: true,
              time: new Date().toISOString(),
            } as ChatProps,
          });
          break;

        default:
          io.emit('response', {
            message: {
              message: parsedContent.followUpMessage,
              name: 'Andy',
              sentByAdmin: true,
              time: new Date().toISOString(),
            } as ChatProps,
          });
          break;
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
