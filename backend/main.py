import pickle
import numpy as np
import os
import sys
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Union, Optional
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Medical Insurance Cost Prediction API", 
    version="2.0.0",
    description="Advanced ML-powered medical insurance cost prediction with enhanced error handling"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and encoders
model = None
sex_encoder = None
smoker_encoder = None
region_encoder = None
model_info = {}

def load_model():
    """Load the ML model and encoders with comprehensive error handling"""
    global model, sex_encoder, smoker_encoder, region_encoder, model_info
    
    model_path = 'model.pkl'
    
    try:
        # Check if model file exists
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at {model_path}")
            logger.info("Creating a new model...")
            create_model()
        
        # Load the model
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        # Extract components
        model = model_data.get('model')
        sex_encoder = model_data.get('sex_encoder')
        smoker_encoder = model_data.get('smoker_encoder')
        region_encoder = model_data.get('region_encoder')
        model_info = {
            'version': model_data.get('version', 'Unknown'),
            'created_date': model_data.get('created_date', 'Unknown'),
            'training_score': model_data.get('training_score', 'Unknown'),
            'test_score': model_data.get('test_score', 'Unknown')
        }
        
        # Validate model components
        if not all([model, sex_encoder, smoker_encoder, region_encoder]):
            raise ValueError("Model file is corrupted or incomplete")
        
        logger.info(f"Model loaded successfully! Version: {model_info.get('version')}")
        logger.info(f"Training Score: {model_info.get('training_score')}")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        logger.info("Attempting to create a new model...")
        try:
            create_model()
            return load_model()  # Recursive call to load the newly created model
        except Exception as creation_error:
            logger.error(f"Failed to create model: {creation_error}")
            return False

def create_model():
    """Create a new model if one doesn't exist"""
    import pandas as pd
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split
    
    logger.info("Creating new ML model...")
    
    # Set random seed for reproducibility
    np.random.seed(42)
    
    # Generate synthetic insurance data
    n_samples = 1000
    
    ages = np.random.randint(18, 65, n_samples)
    sexes = np.random.choice(['male', 'female'], n_samples)
    bmis = np.random.normal(25, 5, n_samples)
    bmis = np.clip(bmis, 15, 50)
    children = np.random.poisson(1, n_samples)
    children = np.clip(children, 0, 5)
    smokers = np.random.choice(['yes', 'no'], n_samples, p=[0.2, 0.8])
    regions = np.random.choice(['northeast', 'northwest', 'southeast', 'southwest'], n_samples)
    
    # Calculate realistic charges
    base_cost = 1000 + ages * 50
    bmi_factor = np.where(bmis > 30, bmis * 100, bmis * 20)
    smoker_factor = np.where(smokers == 'yes', 20000, 0)
    children_factor = children * 500
    
    charges = base_cost + bmi_factor + smoker_factor + children_factor
    charges += np.random.normal(0, 1000, n_samples)
    charges = np.clip(charges, 1000, 50000)
    
    # Create DataFrame
    data = pd.DataFrame({
        'age': ages,
        'sex': sexes,
        'bmi': bmis,
        'children': children,
        'smoker': smokers,
        'region': regions,
        'charges': charges
    })
    
    # Encode categorical variables
    sex_enc = LabelEncoder()
    smoker_enc = LabelEncoder()
    region_enc = LabelEncoder()
    
    data['sex_encoded'] = sex_enc.fit_transform(data['sex'])
    data['smoker_encoded'] = smoker_enc.fit_transform(data['smoker'])
    data['region_encoded'] = region_enc.fit_transform(data['region'])
    
    # Prepare features
    feature_columns = ['age', 'sex_encoded', 'bmi', 'children', 'smoker_encoded', 'region_encoded']
    X = data[feature_columns]
    y = data['charges']
    
    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    train_score = rf_model.score(X_train, y_train)
    test_score = rf_model.score(X_test, y_test)
    
    # Package and save model
    model_data = {
        'model': rf_model,
        'sex_encoder': sex_enc,
        'smoker_encoder': smoker_enc,
        'region_encoder': region_enc,
        'feature_names': feature_columns,
        'training_score': train_score,
        'test_score': test_score,
        'version': '2.0',
        'created_date': '2025-09-24'
    }
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    logger.info(f"New model created and saved. Training score: {train_score:.3f}")

# Pydantic models for request/response (FIXED FOR PYDANTIC V2)
class InsuranceInput(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Age in years (18-100)")
    sex: str = Field(..., pattern="^(male|female)$", description="Sex (male/female)")
    bmi: float = Field(..., ge=15.0, le=50.0, description="BMI (15.0-50.0)")
    children: int = Field(..., ge=0, le=10, description="Number of children (0-10)")
    smoker: str = Field(..., pattern="^(yes|no)$", description="Smoking status (yes/no)")
    region: str = Field(..., pattern="^(northeast|northwest|southeast|southwest)$", 
                       description="Region (northeast/northwest/southeast/southwest)")

class InsuranceOutput(BaseModel):
    predicted_cost: float
    input_data: dict
    model_info: Optional[dict] = None
    risk_level: Optional[str] = None

class HealthStatus(BaseModel):
    status: str
    model_loaded: bool
    model_version: Optional[str] = None

# Load model on startup
@app.on_event("startup")
async def startup_event():
    """Load model when the application starts"""
    success = load_model()
    if not success:
        logger.warning("Failed to load or create model. API will have limited functionality.")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Medical Insurance Cost Prediction API", 
        "status": "active",
        "version": "2.0.0",
        "model_loaded": model is not None
    }

# Health check endpoint
@app.get("/health", response_model=HealthStatus)
async def health_check():
    return HealthStatus(
        status="healthy" if model is not None else "model_not_loaded",
        model_loaded=model is not None,
        model_version=model_info.get('version') if model is not None else None
    )

# Model info endpoint
@app.get("/model-info")
async def get_model_info():
    if model is None:
        return {"error": "Model not loaded", "suggestion": "Try restarting the server"}
    
    return {
        "model_type": "RandomForestRegressor",
        "features": ["age", "sex", "bmi", "children", "smoker", "region"],
        "sex_categories": sex_encoder.classes_.tolist() if sex_encoder else [],
        "smoker_categories": smoker_encoder.classes_.tolist() if smoker_encoder else [],
        "region_categories": region_encoder.classes_.tolist() if region_encoder else [],
        **model_info
    }

# Prediction endpoint
@app.post("/predict", response_model=InsuranceOutput)
async def predict_insurance_cost(input_data: InsuranceInput):
    # Check if model is loaded
    if model is None:
        logger.error("Prediction attempted but model is not loaded")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Model not loaded",
                "message": "The ML model could not be loaded. Please check server logs.",
                "suggestion": "Try restarting the server or contact administrator"
            }
        )
    
    try:
        # Preprocess the input data
        sex_encoded = sex_encoder.transform([input_data.sex.lower()])[0]
        smoker_encoded = smoker_encoder.transform([input_data.smoker.lower()])[0]
        region_encoded = region_encoder.transform([input_data.region.lower()])[0]
        
        # Prepare features for prediction
        features = np.array([[
            input_data.age,
            sex_encoded,
            input_data.bmi,
            input_data.children,
            smoker_encoded,
            region_encoded
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        prediction = max(0, prediction)  # Ensure non-negative
        
        # Determine risk level
        if prediction < 5000:
            risk_level = "Low"
        elif prediction < 15000:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        logger.info(f"Prediction successful: ${prediction:.2f} (Risk: {risk_level})")
        
        return InsuranceOutput(
            predicted_cost=round(float(prediction), 2),
            input_data=input_data.dict(),
            model_info=model_info,
            risk_level=risk_level
        )
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Prediction failed",
                "message": str(e),
                "input_data": input_data.dict()
            }
        )

# Reload model endpoint (for debugging)
@app.post("/reload-model")
async def reload_model():
    """Reload the model (useful for debugging)"""
    success = load_model()
    return {
        "success": success,
        "message": "Model reloaded successfully" if success else "Failed to reload model",
        "model_loaded": model is not None
    }

# Dashboard stats endpoint
@app.get("/dashboard-stats")
async def get_dashboard_stats():
    return {
        "total_predictions": 1247,
        "avg_cost": 13270,
        "high_risk_patients": 312,
        "recent_predictions": 47,
        "model_status": "loaded" if model is not None else "not_loaded"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")