import { Server } from 'socket.io';
import { Order } from '../models/order.model';
import { generateChatResponse } from './chatHandler';

export const orderHandler = async (orderId: string, io: Server) => {
  console.log(orderId, 'order id');

  const order = await Order.findOne({ trackingId: orderId });

  if (!order) {
    io.emit('response', generateChatResponse('Order not found'));
    return;
  }

  if (order) {
    const orderStatus = order.status;
    io.emit(
      'response',
      generateChatResponse(`Your order status is ${orderStatus}`)
    );
  }
};
