# import requests
# from pymongo import MongoClient
# import pymongo
# import schedule
# import time
# from datetime import datetime

# # MongoDB setup
# MONGO_URI = "mongodb://127.0.0.1:27017"  # Or your MongoDB Atlas URI
# client = MongoClient(MONGO_URI)
# db = client["test"]  # Replace with your database name
# users_collection = db["users"]  # Replace with your users collection name

# # Fast2SMS API setup
# FAST2SMS_API_KEY = 'WHrn6NkI8ELYpzQc7ib9JmZDlT4BwCR0UOy1XatFqGSfjPsMAedLMFOX2qagKi7xz6VjDUEWhHcANt83'  # Replace with your actual Fast2SMS API Key
# FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2"

# def fetch_weather_for_city(city_name):
#     """
#     Fetches weather data for a given city.
#     Replace this with your actual weather API call.
#     """
#     print(f"Fetching weather for {city_name}...")
#     # Placeholder: Replace with actual API call
#     # Example: Using OpenWeatherMap or WeatherAPI
#     # For now, returning dummy data with potential extreme conditions
#     # Ensure the API returns data in a consistent format, e.g.:
#     # {'avg_temp_c': 25, 'rainfall_mm': 5, 'date': 'YYYY-MM-DD'}
    
#     # Dummy data for demonstration
#     if city_name.lower() == "mumbai": # Simulate extreme weather for a specific city
#         return {
#             'avg_temp_c': 42,  # Extreme temperature
#             'rainfall_mm': 10,
#             'date': datetime.now().strftime('%Y-%m-%d')
#         }
#     elif city_name.lower() == "delhi":
#          return {
#             'avg_temp_c': 20,
#             'rainfall_mm': 350, # Extreme rainfall
#             'date': datetime.now().strftime('%Y-%m-%d')
#         }
#     return {
#         'avg_temp_c': 30,
#         'rainfall_mm': 5,
#         'date': datetime.now().strftime('%Y-%m-%d')
#     }

# def send_fast2sms_alert(phone_numbers_str, message_body):
#     """
#     Sends an SMS using Fast2SMS API.
#     """
#     if not FAST2SMS_API_KEY or FAST2SMS_API_KEY == 'YOUR_FAST2SMS_API_KEY':
#         print("Error: Fast2SMS API Key not configured. SMS not sent.")
#         return

#     payload = {
#         'sender_id': 'FSTSMS',  # Or your approved Sender ID
#         'message': message_body,
#         'language': 'english',
#         'route': 'q',  # Use 'q' for transactional messages, check Fast2SMS docs
#         'numbers': phone_numbers_str
#     }
#     headers = {
#         'authorization': FAST2SMS_API_KEY,
#         'cache-control': 'no-cache'
#     }
#     try:
#         response = requests.post(FAST2SMS_URL, data=payload, headers=headers)
#         response.raise_for_status()  # Raise an exception for HTTP errors
#         print(f"SMS sending attempt to {phone_numbers_str}. Status: {response.status_code}")
#         print(f"Response: {response.json()}")
#     except requests.exceptions.RequestException as e:
#         print(f"Error sending SMS to {phone_numbers_str}: {e}")
#     except Exception as e:
#         print(f"An unexpected error occurred during SMS sending: {e}")


# def check_weather_and_send_alerts():
#     """
#     Checks weather for all unique user cities and sends alerts for extreme conditions.
#     """
#     print(f"\nRunning weather check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
#     try:
#         # Get all unique districts (cities) from the users collection
#         # Ensure your user documents have a 'district' field
#         distinct_cities = users_collection.distinct("district")
#         if not distinct_cities:
#             print("No distinct cities found in the database.")
#             return

#         print(f"Found distinct cities: {distinct_cities}")

#         for city in distinct_cities:
#             if not city:  # Skip if city is None or empty
#                 continue
            
#             print(f"\nProcessing city: {city}")
#             weather_data = fetch_weather_for_city(city)

#             if not weather_data:
#                 print(f"Could not fetch weather data for {city}.")
#                 continue

#             avg_temp = weather_data.get('avg_temp_c')
#             rainfall = weather_data.get('rainfall_mm')
#             current_date = weather_data.get('date', datetime.now().strftime('%Y-%m-%d'))

#             extreme_conditions_detected = False
#             alert_reasons = []

#             # Define extreme conditions
#             if avg_temp is not None:
#                 if avg_temp > 40:
#                     extreme_conditions_detected = True
#                     alert_reasons.append(f"High Temperature: {avg_temp}°C")
#                 elif avg_temp < 5:
#                     extreme_conditions_detected = True
#                     alert_reasons.append(f"Low Temperature: {avg_temp}°C")
            
#             if rainfall is not None:
#                 if rainfall > 300: # Example: 300mm is extreme rainfall
#                     extreme_conditions_detected = True
#                     alert_reasons.append(f"Heavy Rainfall: {rainfall}mm")

#             if extreme_conditions_detected:
#                 print(f"Extreme weather detected for {city}: {', '.join(alert_reasons)}")
                
#                 # Get phone numbers of users in this city
#                 # Ensure your user documents have a 'phoneNumber' field
#                 users_in_city = users_collection.find(
#                     {"district": city, "phoneNumber": {"$exists": True, "$ne": ""}},
#                     {"phoneNumber": 1, "_id": 0}
#                 )
                
#                 phone_numbers_list = []
#                 for user in users_in_city:
#                     num = str(user.get("phoneNumber", "")).strip()
#                     # Basic validation and formatting for Indian numbers
#                     if num.startswith("+91"):
#                         num = num[3:]
#                     if num.isdigit() and len(num) == 10:
#                         phone_numbers_list.append(num)
                
#                 if phone_numbers_list:
#                     unique_phone_numbers = sorted(list(set(phone_numbers_list))) # Remove duplicates and sort
#                     phone_numbers_str = ",".join(unique_phone_numbers)
                    
#                     message_body = f"⚠️ Weather Alert for {city} ({current_date}):\n"
#                     message_body += "\n".join(alert_reasons)
#                     message_body += "\nPlease take necessary precautions."
                    
#                     print(f"Sending alert to {len(unique_phone_numbers)} users in {city}: {phone_numbers_str}")
#                     send_fast2sms_alert(phone_numbers_str, message_body)
#                 else:
#                     print(f"No valid phone numbers found for users in {city} with extreme weather.")
#             else:
#                 print(f"Weather conditions normal for {city}.")

#     except pymongo.errors.ConnectionFailure:
#         print("Error: Could not connect to MongoDB. Please check if MongoDB is running and accessible.")
#     except Exception as e:
#         print(f"An error occurred in check_weather_and_send_alerts: {e}")

# if __name__ == "__main__":
#     print("Weather Alert Scheduler started.")
#     print(f"Make sure to replace 'YOUR_FAST2SMS_API_KEY' in the script with your actual Fast2SMS API key.")
#     print(f"Also, ensure your MongoDB is running and the 'test' database with 'users' collection exists.")
#     print("Users collection should have 'district' and 'phoneNumber' fields.")
#     print("The script will check weather at 9 AM and 9 PM daily.")

#     # Schedule the job
#     # For testing, you might want to run it more frequently, e.g., every minute:
#     # schedule.every(1).minutes.do(check_weather_and_send_alerts) 
    
#     schedule.every().day.at("19:45").do(check_weather_and_send_alerts)
#     schedule.every().day.at("21:00").do(check_weather_and_send_alerts)
    
#     # Initial run for immediate testing (optional)
#     # print("Performing initial run...")
#     # check_weather_and_send_alerts()
#     # print("Initial run complete. Waiting for scheduled runs...")

#     while True:
#         schedule.run_pending()
#         time.sleep(60)  # Check every 60 seconds



import requests
import pymongo

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["test"]
collection = db["users"]

# Fetch phone numbers
phone_numbers = []
for doc in collection.find({}, {"phoneNumber": 1, "_id": 0}):
    num = str(doc.get("phoneNumber", "")).strip()
    if num.startswith("+91"):
        num = num[3:]
    if num.isdigit() and len(num) == 10:
        phone_numbers.append(num)


# Join into a string
phone_string = ",".join(phone_numbers)
print("Phone numbers fetched:", phone_numbers)
print("Phone string to be sent:", phone_string)

# Fast2SMS API
url = "https://www.fast2sms.com/dev/bulkV2"
payload = {
    
    'sender_id': 'FSTSMS',
    'message': 'This is a test message sent to multiple users.',
    'language': 'english',
    'route': 'q',  # use 'q' for transactional, 'p' for promotional
    'numbers': phone_string
}
headers = {
    'authorization': 'WHrn6NkI8ELYpzQc7ib9JmZDlT4BwCR0UOy1XatFqGSfjPsMAedLMFOX2qagKi7xz6VjDUEWhHcANt83',
    'cache-control': 'no-cache'
    
}

# Send SMS
response = requests.post(url, data=payload, headers=headers)
print(response.status_code)
print(response.json())
