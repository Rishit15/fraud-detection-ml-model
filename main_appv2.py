from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from data_loader import load_data
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import pandas as pd
import os

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)

df_master = load_data(limit=50000)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')
df_master['tender_value_amount'] = df_master['tender_value_amount'].astype(str).str.replace('[,"]', '', regex=True)
df_master['tender_value_amount'] = pd.to_numeric(df_master['tender_value_amount'], errors='coerce').fillna(0)
df_master['tender_numberOfTenderers'] = pd.to_numeric(df_master['tender_numberOfTenderers'], errors='coerce').fillna(0)
@app.route('/api/anomalies')
def get_anomalies():
    
    global df_master
    
    if 'status' not in df_master.columns:
        df_master['status'] = 'Clean'

    manual_mask = df_master['status'].isin(['Confirmed', 'Rejected'])
    
    
    df = df_master.copy()
    
    model = IsolationForest(contamination=0.05, random_state=42)
    scaler1 = StandardScaler()
    a, b = -0.80, -1
    
    
    for iteration in range(1, 6):
        if df.empty: break
        scaled_data = scaler1.fit_transform(df[['tender_value_amount']])
        model.fit(scaled_data)
        scores = model.decision_function(scaled_data)
        
        m_scaler = MinMaxScaler(feature_range=(-1, 1))
        scaled_scores = m_scaler.fit_transform(scores.reshape(-1, 1))
        
        df['is_anomaly'] = (scaled_scores < a) & (scaled_scores > b)
        anomaly_indices = df[df['is_anomaly']==True].index
        
    
        target_indices = [idx for idx in anomaly_indices if not manual_mask[idx]]
        
        if iteration == 1: 
            a, b = -0.60, -0.80
            df_master.loc[target_indices, 'status'] = 'Rejected'
        elif iteration == 2: 
            a, b = -0.40, -0.60
            df_master.loc[target_indices, 'status'] = 'Pending'
        elif iteration == 3: 
             a, b = 0, -0.40
        elif iteration == 4: 
        
            df_master.loc[target_indices, 'status'] = 'Confirmed'
            
        df = df[~df['is_anomaly']].copy() 

    
    activity_feed = []
    for _, row in df_master.head(20).iterrows():
        activity_feed.append({
            "id": str(row.get('tender_id', 'N/A')),
            "amount": f"₹{float(row['tender_value_amount']):,.2f}",
            "status": row['status'],
            "date": str(row.get('tender_datePublished', 'N/A'))[:10],
            "buyer": str(row.get('buyer_name', 'Unknown'))
        })

    df_master['status'] = df_master['status'].fillna('Clean')
    
    clean_data = df_master[['tender_id', 'tender_value_amount', 'tender_numberOfTenderers', 'status']].fillna({
        'tender_id': 'N/A',
        'tender_value_amount': 0,
        'tender_numberOfTenderers': 0,
        'status': 'Clean'
    })

    return jsonify({
        'transfers': len(df_master),
        'activityTable': activity_feed,
        'result': clean_data.to_dict(orient='records')
    })
@app.route('/api/cases/<tender_id>', methods=['PUT'])
def update_case(tender_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        global df_master
        df_master.loc[df_master['tender_id'] == tender_id, 'status'] = new_status

        print(f"✅ Tender {tender_id} → {new_status}")
        return jsonify({
            'success': True,
            'tender_id': tender_id,
            'new_status': new_status
        }), 200
        
    except Exception as e:
        print(f"❌ Update error: {e}")
        return jsonify({'error': str(e)}), 500
@app.route('/<path:filename>')
def static_files(filename):
    """Serve static files (CSS, JS, etc)"""
    file_path = os.path.join('.', filename)
    if os.path.isfile(file_path):
        return send_from_directory('.', filename)
    return {"error": f"File not found: {filename}"}, 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
