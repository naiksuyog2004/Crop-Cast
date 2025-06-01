
import threading
import schedule
import time
from datetime import datetime
import requests
from twilio.rest import Client
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
# from flask_babel import Babel, _
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Ideal conditions with monthly crop phases
def get_ideal_conditions():
    return {
        'Rice': {
            'phases': {
                'sowing': {'months': ['June', 'July'], 'temp': (25, 35), 'rainfall': (80, 150)},
                'vegetative': {'months': ['July', 'August'], 'temp': (25, 35), 'rainfall': (150, 250)},
                'flowering': {'months': ['August', 'September'], 'temp': (25, 32), 'rainfall': (120, 200)},
                'maturity': {'months': ['September', 'October'], 'temp': (20, 30), 'rainfall': (50, 100)}
            }
        },
        'Wheat': {
            'phases': {
                'sowing': {'months': ['November', 'December'], 'temp': (12, 20), 'rainfall': (30, 50)},
                'vegetative': {'months': ['December', 'January'], 'temp': (15, 22), 'rainfall': (50, 75)},
                'flowering': {'months': ['January', 'February'], 'temp': (20, 25), 'rainfall': (20, 40)},
                'maturity': {'months': ['February', 'March'], 'temp': (25, 30), 'rainfall': (10, 20)}
            }
        },
        'Maize': {
            'phases': {
                'sowing': {'months': ['June', 'July'], 'temp': (20, 30), 'rainfall': (60, 100)},
                'vegetative': {'months': ['July', 'August'], 'temp': (22, 32), 'rainfall': (100, 150)},
                'flowering': {'months': ['August', 'September'], 'temp': (25, 30), 'rainfall': (70, 100)},
                'maturity': {'months': ['September', 'October'], 'temp': (25, 30), 'rainfall': (30, 50)}
            }
        },
        'Cotton': {
            'phases': {
                'sowing': {'months': ['June', 'July'], 'temp': (25, 35), 'rainfall': (50, 100)},
                'vegetative': {'months': ['July', 'August'], 'temp': (25, 35), 'rainfall': (80, 120)},
                'flowering': {'months': ['August', 'September'], 'temp': (25, 32), 'rainfall': (70, 100)},
                'maturity': {'months': ['October', 'November'], 'temp': (20, 30), 'rainfall': (30, 60)}
            }
        }
    }

# Main crop suitability checker
def check_crop_suitability(crop, forecast_data):
    ideal = get_ideal_conditions()
    crop_data = ideal.get(crop)
    if not crop_data:
        return [f"❌ Crop '{crop}' is not in the database."]

    result = []
    for day in forecast_data:
        try:
            month = datetime.strptime(day['date'], "%Y-%m-%d").strftime("%B")
            avg_temp = day['avg_temp']
            rainfall = day['rainfall']

            matched_phase = None
            for phase, conditions in crop_data['phases'].items():
                if month in conditions['months']:
                    matched_phase = phase
                    temp_ok = conditions['temp'][0] <= avg_temp <= conditions['temp'][1]
                    rainfall_ok = conditions['rainfall'][0] <= rainfall <= conditions['rainfall'][1]
                    
                    status = "✅ Suitable" if temp_ok and rainfall_ok else "❌ Not Suitable"
                    result.append({
                        'date': day['date'],
                        'phase': phase,
                        'avg_temp': avg_temp,
                        'rainfall': rainfall,
                        'status': status
                    })
                    break

            if not matched_phase:
                result.append({
                    'date': day['date'],
                    'phase': 'Unknown',
                    'avg_temp': avg_temp,
                    'rainfall': rainfall,
                    'status': '⚠️ No phase info for this month'
                })
        except Exception as e:
            result.append({'date': day.get('date', 'unknown'), 'error': str(e)})

    return result


# Function to suggest precautions
# def suggest_precautions(crop, day):
#     precautions = []

#     if crop == "cotton" or crop == "Cotton":
#         if day['avg_temp'] < 21 or day['avg_temp'] > 30:
#             precautions.append("⚠️ Cotton may struggle with temperatures outside 21-30°C. Consider providing shade or irrigation if needed.")
#         if day['rainfall'] < 50:
#             precautions.append("⚠️ Cotton Insufficient rainfall. Irrigation might be required.")
#     elif crop == "rice" or crop == "Rice":
#         if day['avg_temp'] < 20 or day['avg_temp'] > 35:
#             precautions.append("⚠️ Rice may not thrive outside of the 20-35°C range. Monitor water levels closely.")
#         if day['rainfall'] < 100:
#             precautions.append("⚠️ Rice needs more rainfall for optimal growth. Ensure adequate water supply.")
#     elif crop == "wheat" or crop == "Wheat":
#         if day['avg_temp'] < 10 or day['avg_temp'] > 25:
#             precautions.append("⚠️ Wheat is sensitive to temperatures outside 10-25°C. Protect from frost or excessive heat.")
#         if day['rainfall'] < 75:
#             precautions.append("⚠️ Wheat needs moderate rainfall. If rainfall is insufficient, consider irrigation.")
#     elif crop == "maize" or crop == "Maize":
#         if day['avg_temp'] < 18 or day['avg_temp'] > 27:
#             precautions.append("⚠️ Maize prefers temperatures between 18-27°C. Protect from frost or extreme heat.")
#         if day['rainfall'] < 50:
#             precautions.append("⚠️ Insufficient rainfall. Consider irrigation if needed.")

#     return precautions

# Function to suggest precautions
def suggest_precautions(crop, day):
    precautions = []
    ideal = get_ideal_conditions()
    crop_data = ideal.get(crop)
    if not crop_data or 'phases' not in crop_data:
        return precautions

    # Extract month from date
    try:
        month = datetime.strptime(day['date'], "%Y-%m-%d").strftime("%B")
    except Exception:
        month = None

    matched_phase = None
    for phase, conditions in crop_data['phases'].items():
        if month and month in conditions['months']:
            matched_phase = (phase, conditions)
            break

    if not matched_phase:
        precautions.append("⚠️ No phase information available for this month.")
        return precautions

    phase_name, phase_cond = matched_phase
    temp_min, temp_max = phase_cond['temp']
    rain_min, rain_max = phase_cond['rainfall']

    # Temperature precautions
    if day['avg_temp'] < temp_min:
        precautions.append(
            f"⚠️ {crop} ({phase_name.title()} phase): Temperature is below ideal ({temp_min}-{temp_max}°C). Protect from cold, consider delayed sowing or use of mulch."
        )
    elif day['avg_temp'] > temp_max:
        precautions.append(
            f"⚠️ {crop} ({phase_name.title()} phase): Temperature is above ideal ({temp_min}-{temp_max}°C). Provide shade, irrigation, or mulching to reduce heat stress."
        )

    # Rainfall precautions
    if day['rainfall'] < rain_min:
        precautions.append(
            f"⚠️ {crop} ({phase_name.title()} phase): Rainfall is below ideal ({rain_min}-{rain_max}mm). Consider supplemental irrigation or moisture conservation."
        )
    elif day['rainfall'] > rain_max:
        precautions.append(
            f"⚠️ {crop} ({phase_name.title()} phase): Rainfall is above ideal ({rain_min}-{rain_max}mm). Ensure proper drainage to prevent waterlogging and root diseases."
        )

    # General phase-specific advice (optional, can be expanded)
    if phase_name == "sowing":
        precautions.append(f"ℹ️ {crop} ({phase_name.title()} phase): Ensure good seed quality and proper soil preparation.")
    elif phase_name == "vegetative":
        precautions.append(f"ℹ️ {crop} ({phase_name.title()} phase): Monitor for pests and provide nutrients as needed.")
    elif phase_name == "flowering":
        precautions.append(f"ℹ️ {crop} ({phase_name.title()} phase): Avoid water stress and protect from strong winds.")
    elif phase_name == "maturity":
        precautions.append(f"ℹ️ {crop} ({phase_name.title()} phase): Reduce irrigation and prepare for harvest.")

    return precautions


@app.route('/')
def home():
    return "Backend is running!"

# @app.route('/api/predict', methods=['POST'])
# def predict():
#     data = request.json
#     forecast = data.get('forecast', [])
   
    
#     crop = data.get('crop', 'cotton')  # Default crop is rice
#     # Transform the forecast data
#     transformed_forecast = []
#     for day in forecast:
#         transformed_forecast.append({
#             "date": day["date"],
#             "avg_temp": day["day"]["avgtemp_c"],
#             "humidity": day["day"]["avghumidity"],
#             "rainfall": day["day"]["totalprecip_mm"]
#         })

#     print("Transformed forecast data:", transformed_forecast)  # Debugging log

#     # Check crop suitability
#     suitability_results = check_crop_suitability(crop, transformed_forecast)

#     # Add precautions to each day's result
#     for day in suitability_results:
#         day['precautions'] = suggest_precautions(crop, day)

#     return jsonify({'results': suitability_results})

FAST2SMS_API_KEY = 'RFPJGntf52Dzu4ic3EbpqrYg8IAdNmj9KUZ7Ca1HwVxv6TeQMLOmveE2IF3abPT8xygiBK0n7AMuRJz6'  # Replace with your actual Fast2SMS API Key
FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2"

# MongoDB connection setup
MONGO_URI = "mongodb://127.0.0.1:27017"  # Replace with your MongoDB URI
client = MongoClient(MONGO_URI)
db = client['test']  # Replace with your database name
users_collection = db['users']  # Replace with your users collection name

@app.route('/api/predict', methods=['POST'])


def predict():
    data = request.json
    print("Received data:", data)  

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

# #twilio SMS system
# # Twilio credentials (replace with your actual credentials)
# TWILIO_ACCOUNT_SID = 'AC74d3234c1b27da3f53a19340e214c05f'
# TWILIO_AUTH_TOKEN = '33b78e74d180fd56a28dc7c4c6ab113b'
# TWILIO_PHONE_NUMBER = '+17756287044'

# def send_sms(to_phone_number, message):
#     client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
#     try:
#         message = client.messages.create(
#             body=message,
#             from_=TWILIO_PHONE_NUMBER,
#             to=to_phone_number
#         )
#         print(f"Message sent successfully: {message.sid}")
#     except Exception as e:
#         print(f"Failed to send message: {e}")

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
#     for day in limited_prediction:
#         date = day.get('date', 'Unknown Date')
#         status = day.get('status', 'Unknown Status')
#         message += f"- {date}: {status}\n"

#     # Add a note if the message was truncated
#     if len(prediction) > max_days:
#         message += "\n...and more days. Check the app for full details."

#     # Send the SMS
#     send_sms(phone_number, message)

#     return jsonify({'message': 'Prediction sent successfully!'})


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

#     # Add a note if the message was truncated
#     if len(prediction) > max_days:
#         message += "\n...and more days. Check the app for full details."

#     # Add an alert if extreme conditions were detected
#     if extreme_conditions_detected:
#         message += "\n⚠️ Extreme weather conditions detected. Take necessary precautions!"

#     # Send the SMS
#     send_sms(phone_number, message)

#     return jsonify({'message': 'Prediction sent successfully!'})
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

WEATHER_API_KEY = "060390bdc73d4e809d952104250905"  

def fetch_weather_for_city(city_name):
    """
    Fetches weather data for a given city using WeatherAPI.
    """
    print(f"Fetching weather for {city_name}...")
    try:
        url = f"http://api.weatherapi.com/v1/forecast.json"
        params = {
            "key": WEATHER_API_KEY,
            "q": city_name,
            "days": 1,
            "aqi": "no",
            "alerts": "no"
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        forecast = data["forecast"]["forecastday"][0]["day"]
        return {
            'avg_temp_c': forecast["avgtemp_c"],
            'rainfall_mm': forecast["totalprecip_mm"],
            'date': data["forecast"]["forecastday"][0]["date"]
        }
    except Exception as e:
        print(f"Error fetching weather for {city_name}: {e}")
        # Return None or fallback values if needed
        return None
    
def send_fast2sms_alert(phone_numbers_str, message_body):
    """
    Sends an SMS using Fast2SMS API.
    """
    if not FAST2SMS_API_KEY or FAST2SMS_API_KEY ==  'YOUR_FAST2SMS_API_KEY':
        print("Error: Fast2SMS API Key not configured. SMS not sent.")
        return

    payload = {
        'sender_id': 'FSTSMS',
        'message': message_body,
        'language': 'english',
        'route': 'q',
        'numbers': phone_numbers_str
    }
    headers = {
        'authorization': FAST2SMS_API_KEY,
        'cache-control': 'no-cache'
    }
    try:
        response = requests.post(FAST2SMS_URL, data=payload, headers=headers)
        response.raise_for_status()
        print(f"SMS sending attempt to {phone_numbers_str}. Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending SMS to {phone_numbers_str}: {e}")
        print(f"Response content: {getattr(response, 'content', 'No response')}")
    except Exception as e:
        print(f"An unexpected error occurred during SMS sending: {e}")

def check_weather_and_send_alerts():
    """
    Checks weather for all unique user cities and sends alerts for extreme conditions.
    """
    print(f"\nRunning weather check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    try:
        distinct_cities = users_collection.distinct("district")
        if not distinct_cities:
            print("No distinct cities found in the database.")
            return

        print(f"Found distinct cities: {distinct_cities}")

        for city in distinct_cities:
            if not city:
                continue

            print(f"\nProcessing city: {city}")
            weather_data = fetch_weather_for_city(city)

            if not weather_data:
                print(f"Could not fetch weather data for {city}.")
                continue

            avg_temp = weather_data.get('avg_temp_c')
            rainfall = weather_data.get('rainfall_mm')
            current_date = weather_data.get('date', datetime.now().strftime('%Y-%m-%d'))

            extreme_conditions_detected = False
            alert_reasons = []

            if avg_temp is not None:
                if avg_temp > 40:
                    extreme_conditions_detected = True
                    alert_reasons.append(f"High Temperature: {avg_temp}°C")
                elif avg_temp < 5:
                    extreme_conditions_detected = True
                    alert_reasons.append(f"Low Temperature: {avg_temp}°C")

            if rainfall is not None:
                if rainfall > 300:
                    extreme_conditions_detected = True
                    alert_reasons.append(f"Heavy Rainfall: {rainfall}mm")

            # extreme_conditions_detected = True
            # alert_reasons.append(f"Heavy Rainfall: {rainfall}mm")

            if extreme_conditions_detected:
                print(f"Extreme weather detected for {city}: {', '.join(alert_reasons)}")
                users_in_city = users_collection.find(
                    {"district": city, "phoneNumber": {"$exists": True, "$ne": ""}},
                    {"phoneNumber": 1, "_id": 0}
                )
                phone_numbers_list = []
                for user in users_in_city:
                    num = str(user.get("phoneNumber", "")).strip()
                    if num.startswith("+91"):
                        num = num[3:]
                    if num.isdigit() and len(num) == 10:
                        phone_numbers_list.append(num)
                if phone_numbers_list:
                    unique_phone_numbers = sorted(list(set(phone_numbers_list)))
                    phone_numbers_str = ",".join(unique_phone_numbers)
                    message_body = f"⚠️ Weather Alert for {city} ({current_date}):\n"
                    message_body += "\n".join(alert_reasons)
                    message_body += "\nPlease take necessary precautions."
                    print(f"Sending alert to {len(unique_phone_numbers)} users in {city}: {phone_numbers_str}")
                    send_fast2sms_alert(phone_numbers_str, message_body)
                else:
                    print(f"No valid phone numbers found for users in {city} with extreme weather.")
            else:
                print(f"Weather conditions normal for {city}.")

    except Exception as e:
        print(f"An error occurred in check_weather_and_send_alerts: {e}")

def run_scheduler():
    
    schedule.every().day.at("9:00").do(check_weather_and_send_alerts)
    schedule.every().day.at("21:00").do(check_weather_and_send_alerts)
    while True:
        schedule.run_pending()
        time.sleep(60)

# Start the scheduler in a background thread when the Flask app starts
def start_scheduler():
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()


@app.route('/api/send-prediction', methods=['POST'])
def send_prediction():
    data = request.json
    phone_number = data.get('phone_number')
    prediction = data.get('prediction') 

    if not phone_number or not prediction:
        return jsonify({'error': 'Phone number and prediction are required'}), 400

    max_days = 3
    limited_prediction = prediction[:max_days]

    message = "🌾 Crop Suitability Prediction:\n"
    extreme_conditions_detected = False

    for day in limited_prediction:
        date = day.get('date', 'Unknown Date')
        status = day.get('status', 'Unknown Status')
        avg_temp = day.get('avg_temp', 0)
        rainfall = day.get('rainfall', 0)

        # Check for extreme weather conditions
        if avg_temp > 40 or avg_temp < 5:
            extreme_conditions_detected = True
            message += f"- {date}: {status} (⚠️ Extreme Temperature: {avg_temp}°C)\n"
        elif rainfall > 300:
            extreme_conditions_detected = True
            message += f"- {date}: {status} (⚠️ Extreme Rainfall: {rainfall}mm)\n"
        else:
            message += f"- {date}: {status}\n"

    # Add a note if the message was truncated
    if len(prediction) > max_days:
        message += "\n...and more days. Check the app for full details."

    # Add an alert if extreme conditions were detected
    if extreme_conditions_detected:
        message += "\n⚠️ Extreme weather conditions detected. Take necessary precautions!"

    # Send the SMS (using your Twilio send_sms function)
    send_sms(phone_number, message)

    return jsonify({'message': 'Prediction sent successfully!'})



if __name__ == '__main__':
    start_scheduler()
    app.run(debug=True)
