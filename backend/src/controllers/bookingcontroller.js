import { BookingService } from '../services/bookingService';
import { DuffleService } from '../services/duffleService';

class BookingController {
  async createOffer(req, res) {
    try {
      const { searchId, offerId } = req.body;
      const offer = await DuffleService.createOffer(searchId, offerId);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addPassengers(req, res) {
    try {
      const { offerId } = req.params;
      const { passengers } = req.body;
      const updatedOffer = await DuffleService.addPassengers(offerId, passengers);
      res.json(updatedOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async selectSeats(req, res) {
    try {
      const { offerId } = req.params;
      const { seatSelections } = req.body;
      const updatedOffer = await DuffleService.selectSeats(offerId, seatSelections);
      res.json(updatedOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addBaggage(req, res) {
    try {
      const { offerId } = req.params;
      const { baggageSelections } = req.body;
      const updatedOffer = await DuffleService.addBaggage(offerId, baggageSelections);
      res.json(updatedOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const { offerId, paymentDetails } = req.body;
      const order = await DuffleService.createOrder(offerId, paymentDetails);
      
      // Store order in database
      await BookingService.saveOrder({
        orderId: order.id,
        userId: req.user.id,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        currency: order.currency
      });
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const status = await DuffleService.getOrderStatus(orderId);
      res.json(status);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new BookingController();
