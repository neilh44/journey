// backend/src/services/bookingService.js
import { Order } from '../models/order';

class BookingService {
  async saveOrder(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Failed to save order: ${error.message}`);
    }
  }

  async getOrder(orderId) {
    try {
      const order = await Order.findOne({ orderId });
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Failed to retrieve order: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { 
          $set: { 
            status,
            updatedAt: new Date()
          }
        },
        { new: true }
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ userId })
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Failed to retrieve user orders: ${error.message}`);
    }
  }

  async cancelOrder(orderId) {
    try {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { 
          $set: { 
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        },
        { new: true }
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }
}

export default new BookingService();