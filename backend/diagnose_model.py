#!/usr/bin/env python3
"""
Model Diagnostics Script for Medical Insurance Prediction
Place this file in your backend directory (same folder as main.py)
"""

import pickle
import numpy as np
import os

def diagnose_model():
    print("🔍 Diagnosing Medical Insurance Model...")
    
    model_path = 'model.pkl'
    
    # Check if file exists
    if not os.path.exists(model_path):
        print("❌ Model file not found!")
        print("💡 This script should be in your backend directory")
        print("💡 Run 'python create_model.py' to create a new model")
        print("\n📂 Current directory contents:")
        for item in os.listdir('.'):
            print(f"   {item}")
        return False
    
    # Check file size
    file_size = os.path.getsize(model_path)
    print(f"📁 Model file size: {file_size / 1024:.1f} KB")
    
    if file_size < 1000:  # Less than 1KB is suspicious
        print("⚠️  Model file is very small, might be corrupted")
        return False
    
    try:
        # Load model
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        print("✅ Model file loaded successfully")
        
        # Check components
        required_keys = ['model', 'sex_encoder', 'smoker_encoder', 'region_encoder']
        missing_keys = [key for key in required_keys if key not in model_data]
        
        if missing_keys:
            print(f"❌ Missing model components: {missing_keys}")
            return False
        
        print("✅ All model components present")
        
        # Test model
        model = model_data['model']
        sex_encoder = model_data['sex_encoder']
        smoker_encoder = model_data['smoker_encoder']
        region_encoder = model_data['region_encoder']
        
        # Test encoding
        sex_encoded = sex_encoder.transform(['male'])[0]
        smoker_encoded = smoker_encoder.transform(['no'])[0]
        region_encoded = region_encoder.transform(['northeast'])[0]
        
        print("✅ Encoders working correctly")
        
        # Test prediction
        test_features = np.array([[30, sex_encoded, 25.0, 1, smoker_encoded, region_encoded]])
        prediction = model.predict(test_features)[0]
        
        print(f"✅ Test prediction successful: ${prediction:.2f}")
        
        # Print model info
        print(f"📊 Model Info:")
        print(f"   Version: {model_data.get('version', 'Unknown')}")
        print(f"   Created: {model_data.get('created_date', 'Unknown')}")
        print(f"   Training Score: {model_data.get('training_score', 'Unknown')}")
        print(f"   Test Score: {model_data.get('test_score', 'Unknown')}")
        
        print("🎉 Model is working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Error during model diagnosis: {e}")
        return False

if __name__ == "__main__":
    print("📂 Current working directory:", os.getcwd())
    diagnose_model()