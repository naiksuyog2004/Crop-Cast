import joblib
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Example training data (replace with your actual data)
X_train = np.array([
    [25, 60, 80],  # [avgtemp_c, daily_chance_of_rain, avghumidity]
    [30, 20, 50],
    [15, 90, 95],
    [20, 40, 70],
])
y_train = ['Good', 'Moderate', 'Poor', 'Good']  # Example labels

# Train the model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'crop_prediction_model.pkl')
print("Model saved as crop_prediction_model.pkl")