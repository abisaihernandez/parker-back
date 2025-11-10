from flask import Flask, request, jsonify
from sklearn.tree import DecisionTreeClassifier
import numpy as np
from flask_sqlalchemy import SQLAlchemy  
from sqlalchemy.sql import extract     
import sys

app = Flask(__name__)

db_uri = "postgresql://parker:parkerdbpassword@reservations-service-db:5432/db"
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)


class Reservacion(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True) 
    spot_id = db.Column(db.Integer)
    status = db.Column(db.String)
    check_in_at = db.Column(db.DateTime)
    check_out_at = db.Column(db.DateTime)


def load_training_data_from_db():

    
    not_available_slots = set()
    all_known_spots = set()


    with app.app_context():
        try:

            records = db.session.query(
                Reservacion.spot_id,
                extract('dow', Reservacion.check_in_at).label('dia_semana'),
                extract('hour', Reservacion.check_in_at).label('hora_entrada'),
                extract('hour', Reservacion.check_out_at).label('hora_salida')
            ).filter(
                Reservacion.status == 'completed',
                Reservacion.check_in_at != None,
                Reservacion.check_out_at != None,
                Reservacion.check_out_at > Reservacion.check_in_at
            ).all()
            
            for row in records:
                spot_id = int(row.spot_id)
                dia = int(row.dia_semana)
                h_entrada = int(row.hora_entrada)
                h_salida = int(row.hora_salida)
                
                all_known_spots.add(spot_id)
                
                for hour in range(h_entrada, h_salida):
                    not_available_slots.add((spot_id, dia, hour))
            
            print(f"Se procesaron {len(records)} registros de reservación 'completada'.")
            print(f"Se generaron {len(not_available_slots)} 'slots' de no-disponibilidad.")

        except Exception as e:
            print(f"ERROR: No se pudo conectar o consultar la base de datos: {e}", file=sys.stderr)
            return None, None

    #entrenamiento 
    
    X_data = [] # Features [spot_id, dia, hora]
    y_data = [] # Target (0 o 1)

    for spot_id in all_known_spots:
        for day in range(7):
            for hour in range(24):
                X_data.append([spot_id, day, hour])
                
                if (spot_id, day, hour) in not_available_slots:
                    y_data.append(0) # 0 = No Disponible
                else:
                    y_data.append(1) # 1 = Disponible

    if not X_data:
        print("Error: No se generaron datos de entrenamiento.", file=sys.stderr)
        return None, None

    print(f"Set de entrenamiento completo generado con {len(X_data)} muestras.")
    return np.array(X_data), np.array(y_data)

# --- Entrenamiento del Modelo al Iniciar la App (Sin cambios) ---

(X_train, y_train) = load_training_data_from_db()

if X_train is not None and y_train is not None:
    model = DecisionTreeClassifier(criterion='gini')
    model.fit(X_train, y_train)
    print("Modelo de predicción (Gini) entrenado y listo.")
else:
    print("FATAL: No se pudo entrenar el modelo.", file=sys.stderr)
    model = None

# --- Rutas de la API (Sin cambios) ---

@app.route('/availability-forecast', methods=['GET'])
def availability_forecast():
    if model is None:
        return jsonify({"error": "El servicio de predicción no está disponible (falla de modelo)"}), 503

    try:
        day = int(request.args.get('day'))
        hour = int(request.args.get('hour'))
        lot_ids_str = request.args.get('lot_ids')
        if lot_ids_str is None:
            raise ValueError("Missing parameter 'lot_ids'")
        lot_ids = [int(x) for x in lot_ids_str.split(',')]
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing parameters"}), 400

    if not (0 <= day <= 6):
        return jsonify({"error": "Parameter 'day' must be between 0 and 6"}), 400
    if not (0 <= hour <= 23):
        return jsonify({"error": "Parameter 'hour' must be between 0 and 23"}), 400
    if any(lot_id < 0 for lot_id in lot_ids):
        return jsonify({"error": "All 'lot_ids' must be positive integers"}), 400

    forecasts = dict()
    for lot_id in lot_ids:
        
        input_features = np.array([[lot_id, day, hour]])
        predicted_class_raw = model.predict(input_features)[0]
        predicted_proba_raw = model.predict_proba(input_features)[0]
        predicted_class = int(predicted_class_raw)
        confidence = float(predicted_proba_raw[predicted_class])
        
        forecasts[lot_id] = {
            "predictedAvailability": predicted_class, 
            "confidence": confidence
        }

    return jsonify(forecasts), 200



if __name__ == '__main__':
    app.run(debug=True)