
from twilio.rest import Client
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
# from flask_babel import Babel, _
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define ideal conditions for crops
ideal_conditions = {
    'Rice': {
        'temp_range': (20, 35),
        'humidity_range': (70, 90),
        'rainfall_mm': (100, 200)
    },
    'Wheat': {
        'temp_range': (10, 25),
        'humidity_range': (50, 60),
        'rainfall_mm': (75, 125)
    },
    'Maize': {
        'temp_range': (18, 27),
        'humidity_range': (60, 70),
        'rainfall_mm': (50, 100)
    },
    'Cotton': {
        'temp_range': (21, 30),
        'humidity_range': (50, 70),
        'rainfall_mm': (50, 80)
    }
}

# Function to check crop suitability
def check_crop_suitability(crop, forecast_data):
    if crop not in ideal_conditions:
        return f"❌ Crop '{crop}' is not in the database."

    crop_data = ideal_conditions[crop]
    result = []

    for day in forecast_data:
        temp_ok = crop_data['temp_range'][0] <= day['avg_temp'] <= crop_data['temp_range'][1]
        humidity_ok = crop_data['humidity_range'][0] <= day['humidity'] <= crop_data['humidity_range'][1]
        rainfall_ok = crop_data['rainfall_mm'][0] <= day['rainfall'] <= crop_data['rainfall_mm'][1]

        status = "✅ Suitable" if temp_ok and humidity_ok and rainfall_ok else "❌ Not Suitable"

        result.append({
            'date': day['date'],
            'avg_temp': day['avg_temp'],
            'humidity': day['humidity'],
            'rainfall': day['rainfall'],
            'status': status
        })

    return result

# Function to suggest precautions
def suggest_precautions(crop, day):
    precautions = []

    if crop == "cotton" or crop == "Cotton":
        if day['avg_temp'] < 21 or day['avg_temp'] > 30:
            precautions.append("⚠️ Cotton may struggle with temperatures outside 21-30°C. Consider providing shade or irrigation if needed.")
        if day['rainfall'] < 50:
            precautions.append("⚠️ Cotton Insufficient rainfall. Irrigation might be required.")
    elif crop == "rice" or crop == "Rice":
        if day['avg_temp'] < 20 or day['avg_temp'] > 35:
            precautions.append("⚠️ Rice may not thrive outside of the 20-35°C range. Monitor water levels closely.")
        if day['rainfall'] < 100:
            precautions.append("⚠️ Rice needs more rainfall for optimal growth. Ensure adequate water supply.")
    elif crop == "wheat" or crop == "Wheat":
        if day['avg_temp'] < 10 or day['avg_temp'] > 25:
            precautions.append("⚠️ Wheat is sensitive to temperatures outside 10-25°C. Protect from frost or excessive heat.")
        if day['rainfall'] < 75:
            precautions.append("⚠️ Wheat needs moderate rainfall. If rainfall is insufficient, consider irrigation.")
    elif crop == "maize" or crop == "Maize":
        if day['avg_temp'] < 18 or day['avg_temp'] > 27:
            precautions.append("⚠️ Maize prefers temperatures between 18-27°C. Protect from frost or extreme heat.")
        if day['rainfall'] < 50:
            precautions.append("⚠️ Insufficient rainfall. Consider irrigation if needed.")

    return precautions

@app.route('/')
def home():
    return "Backend is running!"

# @app.route('/api/predict', methods=['POST'])
# def predict():
    data = request.json
    forecast = data.get('forecast', [])
   
    
    crop = data.get('crop', 'cotton')  # Default crop is rice
    # Transform the forecast data
    transformed_forecast = []
    for day in forecast:
        transformed_forecast.append({
            "date": day["date"],
            "avg_temp": day["day"]["avgtemp_c"],
            "humidity": day["day"]["avghumidity"],
            "rainfall": day["day"]["totalprecip_mm"]
        })

    print("Transformed forecast data:", transformed_forecast)  # Debugging log

    # Check crop suitability
    suitability_results = check_crop_suitability(crop, transformed_forecast)

    # Add precautions to each day's result
    for day in suitability_results:
        day['precautions'] = suggest_precautions(crop, day)

    return jsonify({'results': suitability_results})


# MongoDB connection setup
MONGO_URI = "mongodb://127.0.0.1:27017"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client['test']  # Replace with your database name
users_collection = db['users']  # Replace with your users collection name

@app.route('/api/predict', methods=['POST'])


def predict():
    data = request.json
    print("Received data:", data)  # ✅ Log the full request body

    user_id = data.get('userId')
    print("Received userId:", user_id)

    forecast = data.get('forecast', [])

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        print("User document from DB:", user)
        crop = user.get('crop', 'cotton') if user else 'cotton'
        print("Crop:", crop)
    except Exception as e:
        print("Error fetching user:", e)
        crop = 'cotton'

    # Transform the forecast data
    transformed_forecast = []
    for day in forecast:
        transformed_forecast.append({
            "date": day["date"],
            "avg_temp": day["day"]["avgtemp_c"],
            "humidity": day["day"]["avghumidity"],
            "rainfall": day["day"]["totalprecip_mm"]
        })

    # Check crop suitability (make sure this returns list of dicts)
    suitability_results = check_crop_suitability(crop, transformed_forecast)

    # Add precautions to each day's result
    for day in suitability_results:
        if isinstance(day, dict):
            day['precautions'] = suggest_precautions(crop, day)

    return jsonify({'results': suitability_results})

#twilio SMS system
# Twilio credentials (replace with your actual credentials)
TWILIO_ACCOUNT_SID = 'AC74d3234c1b27da3f53a19340e214c05f'
TWILIO_AUTH_TOKEN = '33b78e74d180fd56a28dc7c4c6ab113b'
TWILIO_PHONE_NUMBER = '+17756287044'

def send_sms(to_phone_number, message):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone_number
        )
        print(f"Message sent successfully: {message.sid}")
    except Exception as e:
        print(f"Failed to send message: {e}")

@app.route('/api/send-prediction', methods=['POST'])
def send_prediction():
    data = request.json
    phone_number = data.get('phone_number')  # User's phone number
    prediction = data.get('prediction')  # Prediction data

    if not phone_number or not prediction:
        return jsonify({'error': 'Phone number and prediction are required'}), 400

    # Limit the number of days to include in the message (e.g., 3 days)
    max_days = 1
    limited_prediction = prediction[:max_days]

    # Format the prediction message (only suitability status)
    message = "🌾 Crop Suitability Prediction:\n"
    for day in limited_prediction:
        date = day.get('date', 'Unknown Date')
        status = day.get('status', 'Unknown Status')
        message += f"- {date}: {status}\n"

    # Add a note if the message was truncated
    if len(prediction) > max_days:
        message += "\n...and more days. Check the app for full details."

    # Send the SMS
    send_sms(phone_number, message)

    return jsonify({'message': 'Prediction sent successfully!'})


## auto message sender 
# @app.route('/api/send-prediction', methods=['POST'])
# def send_prediction():
#     data = request.json
#     phone_number = data.get('phone_number')  # User's phone number
#     prediction = data.get('prediction')  # Prediction data

#     if not phone_number or not prediction:
#         return jsonify({'error': 'Phone number and prediction are required'}), 400

#     # Limit the number of days to include in the message (e.g., 3 days)
#     max_days = 1
#     limited_prediction = prediction[:max_days]

#     # Format the prediction message (only suitability status)
#     message = "🌾 Crop Suitability Prediction:\n"
#     extreme_conditions_detected = False

#     for day in limited_prediction:
#         date = day.get('date', 'Unknown Date')
#         status = day.get('status', 'Unknown Status')
#         avg_temp = day.get('avg_temp', 0)
#         rainfall = day.get('rainfall', 0)

#         # Check for extreme weather conditions
#         if avg_temp > 40 or avg_temp < 5:
#             extreme_conditions_detected = True
#             message += f"- {date}: {status} (⚠️ Extreme Temperature: {avg_temp}°C)\n"
#         elif rainfall > 300:
#             extreme_conditions_detected = True
#             message += f"- {date}: {status} (⚠️ Extreme Rainfall: {rainfall}mm)\n"
#         else:
#             message += f"- {date}: {status}\n"

    # Add a note if the message was truncated
    if len(prediction) > max_days:
        message += "\n...and more days. Check the app for full details."

    # Add an alert if extreme conditions were detected
    if extreme_conditions_detected:
        message += "\n⚠️ Extreme weather conditions detected. Take necessary precautions!"

    # Send the SMS
    send_sms(phone_number, message)

    return jsonify({'message': 'Prediction sent successfully!'})
@app.route('/api/get-district', methods=['POST'])
def get_district():
    data = request.json
    user_id = data.get('userId')

    if not user_id:
        return jsonify({'error': 'userId is required'}), 400

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user and 'district' in user:
            return jsonify({'district': user['district']})
        else:
            return jsonify({'error': 'District not found for user'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

