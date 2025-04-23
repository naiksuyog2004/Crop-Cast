import fetch from 'node-fetch';
import twilio from 'twilio';
import { db } from "../firebase/firebase.config.js";
import { collection, getDocs } from "firebase/firestore";

// OpenWeatherMap API and Twilio Configuration
const API_KEY = '2d7eb7a1d9b3218ec9bd36df96233cfd';
const CITY = 'Alibag'; // Target city
const WEATHER_URL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

const TWILIO_ACCOUNT_SID = 'AC74d3234c1b27da3f53a19340e214c05f';
const TWILIO_AUTH_TOKEN = '33b78e74d180fd56a28dc7c4c6ab113b';
const TWILIO_PHONE_NUMBER = '+19787888351'; // Your Twilio phone number

// Initialize Twilio Client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Fetch Weather Data
async function fetchWeatherData() {
    try {
        const response = await fetch(WEATHER_URL);
        if (response.ok) {
            const data = await response.json();
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            return `The current weather in ${CITY} is ${weatherDescription} with a temperature of ${temperature}°C.`;
        } else {
            console.error("Error fetching weather data:", response.statusText);
            return "Could not fetch weather data.";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return "Could not fetch weather data.";
    }
}

// Fetch Phone Numbers from Firestore
async function fetchPhoneNumbers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Replace 'users' with your Firestore collection name
        const users = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            // Check if the user's city matches the target city and phone number is present
            if (data.city === CITY && data.phone) {
                users.push({
                    phone: data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`, // Format phone number
                    city: data.city,
                    fullName: data.fullName, // Optional for logging
                    email: data.email       // Optional for debugging
                });
            }
        });
        return users;
    } catch (error) {
        console.error("Error fetching phone numbers from Firestore:", error);
        return [];
    }
}

// Send SMS
async function sendSMS(recipientPhone, body) {
    try {
        await client.messages.create({
            body: body,
            from: TWILIO_PHONE_NUMBER,
            to: recipientPhone
        });
        console.log(`SMS sent to ${recipientPhone}`);
    } catch (error) {
        console.error(`Error sending SMS to ${recipientPhone}:`, error);
    }
}

// Main Function to Send Weather Updates
async function sendWeatherUpdates() {
    try {
        const weatherMessage = await fetchWeatherData();
        const users = await fetchPhoneNumbers();

        if (users.length === 0) {
            console.log("No users found for the specified city.");
            return;
        }

        for (const user of users) {
            console.log(`Sending SMS to ${user.fullName} (${user.phone})`);
            await sendSMS(user.phone, weatherMessage);
        }
    } catch (error) {
        console.error("Error sending weather updates:", error);
    }
}

// Execute the Main Function
sendWeatherUpdates();
