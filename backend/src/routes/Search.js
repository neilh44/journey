import express from 'express';
import { FlightBookingAgent } from '../services/FlightBookingAgent.js';

export const searchRouter = express.Router();

searchRouter.post('/', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const agent = new FlightBookingAgent();
        
        // Convert natural language to JSON
        const queryJson = await agent.naturalLanguageToJson(query);
        
        // Search flights
        const flights = await agent.searchFlights(queryJson);
        
        res.json({
            parsed_query: queryJson,
            flights: flights
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});