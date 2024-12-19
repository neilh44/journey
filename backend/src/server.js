// backend/src/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

class FlightBookingAgent {
    constructor() {
        this.groqClient = new Groq();
        this.duffelApiKey = process.env.DUFFEL_API_KEY;
        
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY environment variable is not set");
        }
        if (!this.duffelApiKey) {
            throw new Error("DUFFEL_API_KEY environment variable is not set");
        }
    }

    async naturalLanguageToJson(query) {
        const systemPrompt = `You are a flight booking assistant. Convert the query into proper JSON for flight booking.
        Output ONLY a JSON object without any explanation or additional text.

        Example input: "Flight from London to New York on December 15th for 2 passengers in economy"
        Expected output:
        {
            "departure_city": "LHR",
            "arrival_city": "JFK",
            "departure_date": "2024-12-15",
            "number_of_passengers": 2,
            "cabin_class": "economy"
        }`;

        try {
            const completion = await this.groqClient.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Convert to JSON: ${query}` }
                ],
                model: "mixtral-8x7b-32768",
                temperature: 0,
            });

            let response = completion.choices[0]?.message?.content.trim();
            
            if (response.includes("```json")) {
                response = response.split("```json")[1].split("```")[0];
            } else if (response.includes("```")) {
                response = response.split("```")[1];
            }
            
            return JSON.parse(response.trim());
        } catch (error) {
            console.error("Error processing LLM response:", error);
            throw new Error(`Error in LLM processing: ${error.message}`);
        }
    }

    async searchFlights(queryJson) {
        try {
            const requestData = {
                data: {
                    slices: [{
                        origin: queryJson.departure_city,
                        destination: queryJson.arrival_city,
                        departure_date: queryJson.departure_date
                    }],
                    passengers: Array(queryJson.number_of_passengers).fill({ type: "adult" }),
                    cabin_class: queryJson.cabin_class.toLowerCase()
                }
            };

            const headers = {
                "Authorization": `Bearer ${this.duffelApiKey}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Duffel-Version": "v1"
            };

            console.log("Creating offer request...");
            const offerResponse = await axios.post(
                "https://api.duffel.com/air/offer_requests",
                requestData,
                { headers }
            );

            const offerRequestId = offerResponse.data.data.id;
            console.log(`Offer request created with ID: ${offerRequestId}`);

            console.log("Fetching offers...");
            const offersResponse = await axios.get(
                `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}`,
                { headers }
            );

            const offers = offersResponse.data.data || [];
            console.log(`Found ${offers.length} offers`);

            return offers.map(offer => ({
                id: offer.id,
                owner: { name: offer.owner?.name || 'Unknown Airline' },
                total_amount: offer.total_amount,
                total_currency: offer.total_currency,
                slices: offer.slices?.map(slice => ({
                    origin: { city_name: slice.origin?.city?.name },
                    destination: { city_name: slice.destination?.city?.name },
                    departing_at: slice.departing_at,
                    duration: slice.duration
                }))
            }));

        } catch (error) {
            console.error("Flight search error:", error);
            throw new Error(`Failed to fetch flights: ${error.message}`);
        }
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Journey API' });
});

app.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const agent = new FlightBookingAgent();
        const queryJson = await agent.naturalLanguageToJson(query);
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

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', message: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});