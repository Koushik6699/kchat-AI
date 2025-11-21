from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # allow requests from your browser

# 🔑 PUT YOUR GEMINI API KEY HERE
genai.configure(api_key="AIzaSyBCC-V3Nh0zOqQM51m77HH12QQfMNE9CH4")

# choose a good model for chat
model = genai.GenerativeModel("models/gemini-2.5-flash")


@app.route("/chat", methods=["POST"])
def chat():
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


if __name__ == "__main__":
    # Run on localhost:5000
    app.run(host="127.0.0.1", port=5000, debug=True)
