import { Groq } from 'groq-sdk';
import axios from 'axios';

export class FlightBookingAgent {
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
        // ... previous naturalLanguageToJson code ...
    }

    async searchFlights(queryJson) {
        // ... previous searchFlights code ...
    }
}