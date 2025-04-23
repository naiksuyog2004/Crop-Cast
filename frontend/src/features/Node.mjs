import fetch from "node-fetch";
import twilio from "twilio";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Firebase Admin initialization
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

// OpenWeatherMap and Twilio credentials
const API_KEY = "19761d1b99e65803d73b563060013ff2";
const TWILIO_ACCOUNT_SID = "ACc90b01dc3b9e5727a207731cb591b9a7";
const TWILIO_AUTH_TOKEN = "01ff4b225bc6f12d54bb991add7e0275";
const TWILIO_PHONE_NUMBER = "+17754166209";

const WEATHER_URL = (city) =>
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

// Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Function to fetch weather data
async function fetchWeatherData(city) {
    try {
        const response = await fetch(WEATHER_URL(city));
        if (response.ok) {
            const data = await response.json();
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            return `The current weather in ${city} is ${weatherDescription} with a temperature of ${temperature}°C.`;
        } else {
            return "Could not fetch weather data.";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return "Could not fetch weather data.";
    }
}

// Function to fetch users from Firestore
async function fetchUsers() {
    try {
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map((doc) => doc.data());
        return users;
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        return [];
    }
}

// Function to send SMS
async function sendSMS(recipientPhone, body) {
    try {
        await client.messages.create({
            body: body,
            from: TWILIO_PHONE_NUMBER,
            to: recipientPhone,
        });
        console.log(`SMS sent to ${recipientPhone}`);
    } catch (error) {
        console.error(`Error sending SMS to ${recipientPhone}:`, error);
    }
}

// Main function to send weather updates
async function sendWeatherUpdates() {
    const users = await fetchUsers();
    const targetCity = "Alibag";

    for (const user of users) {
        if (user.city === targetCity) {
            const weatherMessage = await fetchWeatherData(user.city);
            const cropMessage = `Crop-specific info for your crops: ${user.crops.join(", ")}.`;
            const finalMessage = `${weatherMessage}\n${cropMessage}`;
            await sendSMS(user.phone, finalMessage);
        }
    }
}

// Execute the main function
sendWeatherUpdates();
