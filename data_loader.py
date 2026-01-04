import pandas as pd
import os

def load_data(limit=50000):
    csv_file = "main.csv" 
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found. Ensure the CSV is in your Windows Downloads.")
        return None

    print(f"Loading data locally from {csv_file}...")
    try:
        df = pd.read_csv(csv_file, nrows=limit)
        
        print(f"Loaded {len(df)} rows. System Synchronized.")
        return df
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None