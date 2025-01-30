import { Server } from 'socket.io';
import { Order } from '../models/order.model';
import { generateChatResponse } from './chatHandler';

export const productDetailsHandler = async (orderId: string, io: Server) => {
  console.log(orderId, 'order id');

  const order = await Order.findOne({ trackingId: orderId });

  if (!order) {
    io.emit('response', generateChatResponse('Order not found'));
    return;
  }

  if (order) {
    io.emit(
      'response',
      generateChatResponse(
        `Your product details are,  amount is ${order.totalAmount} and tracking id is ${order.trackingId}, with status of ${order.status}`
      )
    );
  }
};
