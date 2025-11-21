from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyBCC-V3Nh0zOqQM51m77HH12QQfMNE9CH4")
model = genai.GenerativeModel("models/gemini-2.5-flash")

@app.route("/", methods=["GET"])
def home():
  return "KCHATAI backend is running ✅", 200

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        return jsonify({"message": "Use POST with JSON: { 'message': 'your text' }"}), 200

    data = request.get_json()
    user_message = (data.get("message") or "").strip() if data else ""

    if not user_message:
        return jsonify({"reply": "Please type a message first."}), 400

    try:
        response = model.generate_content(user_message)
        bot_reply = getattr(response, "text", "").strip() or "Sorry, I couldn't generate a reply."
        return jsonify({"reply": bot_reply})
    except Exception as e:
        print("Error talking to Gemini:", e)
        return jsonify({"reply": "Server error while talking to AI. Try again."}), 500
