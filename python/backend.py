import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing")

genai.configure(api_key=API_KEY)
print("✅ Gemini API configured")

# ✅ USE SUPPORTED MODEL
model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/", methods=["GET"])
def home():
    return "KCHATAI backend running", 200

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        msg = data.get("message", "").strip()

        if not msg:
            return jsonify({"reply": "Please type something."}), 400

        response = model.generate_content(msg)
        return jsonify({"reply": response.text}), 200

    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"reply": "Server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
