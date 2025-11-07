from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/availability-forecast', methods=['GET'])
def availability_forecast():
    # Get query parameters
    try:
        day = int(request.args.get('day'))
        hour = int(request.args.get('hour'))
        lot_ids_str = request.args.get('lot_ids')
        if lot_ids_str is None:
            raise ValueError("Missing parameter 'lot_ids'")
        lot_ids = [int(x) for x in lot_ids_str.split(',')]
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing parameters"}), 400

    # Validate parameter ranges
    if not (0 <= day <= 6):
        return jsonify({"error": "Parameter 'day' must be between 0 and 6"}), 400
    if not (0 <= hour <= 23):
        return jsonify({"error": "Parameter 'hour' must be between 0 and 23"}), 400
    if any(lot_id < 0 for lot_id in lot_ids):
        return jsonify({"error": "All 'lot_ids' must be positive integers"}), 400

    # Mock forecast for each lot
    forecasts = dict()
    for lot_id in lot_ids:
        forecasts[lot_id] = {
            "predictedAvailability": random.randint(1, 15),
            "confidence": 0.85
        }

    return jsonify(forecasts), 200


if __name__ == '__main__':
    app.run(debug=True)
