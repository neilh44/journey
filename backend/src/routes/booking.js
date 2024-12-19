import express from 'express';
import { validateBooking } from '../middleware/validation';
import BookingController from '../controllers/bookingController';

const router = express.Router();

router.post('/offers/create', validateBooking, BookingController.createOffer);
router.post('/offers/:offerId/passengers', BookingController.addPassengers);
router.post('/offers/:offerId/seats', BookingController.selectSeats);
router.post('/offers/:offerId/baggage', BookingController.addBaggage);
router.post('/orders/create', BookingController.createOrder);
router.get('/orders/:orderId/status', BookingController.getOrderStatus);

export default router;

