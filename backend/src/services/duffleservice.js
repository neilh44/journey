// backend/src/services/duffleService.js
import axios from 'axios';
import { config } from '../config/duffle';

class DuffleService {
  constructor() {
    this.client = axios.create({
      baseURL: config.DUFFLE_API_URL,
      headers: {
        'Authorization': `Bearer ${config.DUFFLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createOffer(searchId, offerId) {
    try {
      const response = await this.client.post('/api/offers/create', {
        search_id: searchId,
        offer_id: offerId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addPassengers(offerId, passengers) {
    try {
      const response = await this.client.post(`/api/offers/${offerId}/passengers`, {
        passengers: passengers.map(passenger => ({
          type: passenger.type,
          title: passenger.title,
          first_name: passenger.firstName,
          last_name: passenger.lastName,
          date_of_birth: passenger.dateOfBirth,
          email: passenger.email,
          phone: passenger.phone,
          nationality: passenger.nationality,
          document: {
            type: passenger.documentType,
            number: passenger.documentNumber,
            expiry_date: passenger.documentExpiryDate,
            issuing_country: passenger.documentIssuingCountry
          }
        }))
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async selectSeats(offerId, seatSelections) {
    try {
      const response = await this.client.post(`/api/offers/${offerId}/seats`, {
        seat_selections: seatSelections
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addBaggage(offerId, baggageSelections) {
    try {
      const response = await this.client.post(`/api/offers/${offerId}/baggage`, {
        baggage_selections: baggageSelections
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrder(offerId, paymentDetails) {
    try {
      const response = await this.client.post(`/api/orders/create`, {
        offer_id: offerId,
        payment: {
          type: paymentDetails.type,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          payment_method: paymentDetails.paymentMethod
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderStatus(orderId) {
    try {
      const response = await this.client.get(`/api/orders/${orderId}/status`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new Error(`Invalid request: ${data.message}`);
        case 401:
          throw new Error('Unauthorized: Invalid API key');
        case 404:
          throw new Error('Resource not found');
        case 429:
          throw new Error('Rate limit exceeded');
        default:
          throw new Error(`Duffle API error: ${data.message}`);
      }
    }
    throw new Error('Network error occurred');
  }
}

export default new DuffleService();