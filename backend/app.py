from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

ZONES = ['Library', 'Cafeteria', 'Labs', 'Gardens', 'Parking']
ZONE_SEEDS = {
    'Library': {'temp': 21, 'humidity': 45, 'energy': 52, 'air': 35},
    'Cafeteria': {'temp': 25, 'humidity': 55, 'energy': 78, 'air': 62},
    'Labs': {'temp': 23, 'humidity': 48, 'energy': 69, 'air': 41},
    'Gardens': {'temp': 20, 'humidity': 58, 'energy': 24, 'air': 18},
    'Parking': {'temp': 27, 'humidity': 44, 'energy': 33, 'air': 57},
}

LEADERBOARD = [
    {'user': 'Ana V.', 'team': 'EcoMinds', 'points': 1280, 'actions': 42},
    {'user': 'Miguel T.', 'team': 'GreenLabs', 'points': 1175, 'actions': 38},
    {'user': 'Kevin R.', 'team': 'EcoMinds', 'points': 1030, 'actions': 31},
    {'user': 'Luisa C.', 'team': 'SolarCrew', 'points': 980, 'actions': 27},
    {'user': 'Jorge M.', 'team': 'SolarCrew', 'points': 905, 'actions': 25},
]

def clamp(val, min_v, max_v):
    return max(min_v, min(max_v, val))

@app.route('/api/metrics/live')
def get_live_metrics():
    zones_data = []
    total_energy = 0
    total_air = 0
    
    for zone in ZONES:
        seed = ZONE_SEEDS[zone]
        temp = clamp(seed['temp'] + random.uniform(-2, 2), 17, 34)
        hum = clamp(seed['humidity'] + random.uniform(-5, 5), 30, 80)
        en = clamp(seed['energy'] + random.uniform(-10, 10), 10, 100)
        air = clamp(seed['air'] + random.uniform(-8, 8), 5, 100)
        
        risk = en * 0.6 + air * 0.4
        status = 'Normal'
        if risk > 72: status = 'Critical'
        elif risk > 50: status = 'Attention'
        
        zones_data.append({
            'zone': zone,
            'temperature': round(temp, 1),
            'humidity': round(hum, 1),
            'energy': round(en, 1),
            'airQuality': round(air, 1),
            'status': status
        })
        total_energy += en
        total_air += air
        
    avg_energy = total_energy / len(ZONES)
    avg_air = total_air / len(ZONES)
    score = round(clamp(100 - (avg_energy * 0.45 + avg_air * 0.35), 0, 100))
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'score': score,
        'zones': zones_data
    })

@app.route('/api/metrics/history')
def get_history():
    zone = request.args.get('zone', 'Library')
    points = 24
    now = datetime.now()
    history = []
    
    for i in range(points):
        ts = (now - timedelta(hours=points-i)).isoformat()
        history.append({
            'timestamp': ts,
            'temperature': round(22 + random.uniform(-3, 3), 1),
            'energy': round(50 + random.uniform(-15, 15), 1),
            'humidity': round(45 + random.uniform(-10, 10), 1)
        })
    return jsonify({'history': history})

@app.route('/api/gamification/leaderboard')
def get_leaderboard():
    return jsonify({'leaderboard': LEADERBOARD})

@app.route('/api/reports/eco-action', methods=['POST'])
def submit_report():
    data = request.json
    impact = data.get('impact', 'Medium')
    points = {'Low': 20, 'Medium': 35, 'High': 50}.get(impact, 35)
    return jsonify({
        'points': points,
        'message': f"Acción reportada exitosamente. ¡Has ganado {points} puntos!"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
