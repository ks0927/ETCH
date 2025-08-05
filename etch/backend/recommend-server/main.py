from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/health")
def health_check():
    return jsonify({
        "status": "ok",
        "service": "recommend-server"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8084)

