from flask import Flask, render_template, request, jsonify, flash
import numpy as np
from joblib import load
import os
import google.generativeai as genai
import json
import traceback

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Add a secret key for flash messages

# Load the model and scaler
try:
    model = load('src\models\linear_regression_model.joblib')
    scaler = load('src\models\scaler.joblib')
    model_loaded = True
except Exception as e:
    print(f"Error loading model: {e}")
    model_loaded = False

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("API_KEY")  
genai.configure(api_key=GOOGLE_API_KEY)

@app.route('/')
def index():
    if not model_loaded:
        return render_template('index.html', error="Model could not be loaded. Please contact the administrator.")
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Validate that form data exists
        if 'years_experience' not in request.form:
            return render_template('index.html', error="Please provide years of experience.")
        
        # Get data from form and convert to float
        experience_str = request.form['years_experience']
        try:
            experience = float(experience_str)
        except ValueError:
            return render_template('index.html', error="Years of experience must be a number.")
        
        # Validate range
        if experience < 0 or experience > 50:
            return render_template('index.html', error="Please enter experience between 0 and 50 years.")
        
        # Preprocess input
        input_data = np.array([[experience]])
        scaled_input = scaler.transform(input_data)
        
        # Make prediction
        prediction = model.predict(scaled_input)[0]
        
        # Format prediction - add commas for thousands
        predicted_salary = f"${prediction:,.2f}"
        
        # Generate Gemini response
        try:
            gemini_response = get_gemini_response(experience, prediction)
        except Exception as gemini_error:
            print(f"Gemini API error: {gemini_error}")
            gemini_response = "<p>Sorry, AI insights are temporarily unavailable. Please try again later.</p>"
        
        return render_template('result.html', 
                              years_experience=experience, 
                              predicted_salary=predicted_salary,
                              gemini_response=gemini_response)
    
    except Exception as e:
        # Log the full error for debugging
        print(f"Prediction error: {e}")
        traceback.print_exc()
        return render_template('index.html', error=f"An error occurred: {str(e)}")

def get_gemini_response(experience, salary):
    model = genai.GenerativeModel('gemini-2.0-flash-lite')
    
    prompt = f"""
    A person with {experience} years of experience is predicted to earn a salary of ${salary:.2f}.
    
    Please provide:
    1. How does this salary compare to industry standards?
    2. What skills might this person have at this experience level?
    3. What advice would you give for career growth at this stage?
    
    Format your response in HTML with appropriate tags for headings and paragraphs.
    """
    
    # Add error handling and timeout for the API call
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "<p>Unable to generate AI insights at this time.</p>"

# Add a route for handling errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html', error="Page not found. Please use the form to make a prediction."), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('index.html', error="Server error. Please try again later."), 500

if __name__ == '__main__':
    app.run(debug=True)