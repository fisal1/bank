from flask import Flask
from flask_cors import CORS
from routes import upload_bp, ask_bp
import os

app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

# Ensure directories exist
os.makedirs('uploads', exist_ok=True)
os.makedirs('data', exist_ok=True)

app.register_blueprint(upload_bp)
app.register_blueprint(ask_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
