from flask import Flask, render_template, request, jsonify
from logic.evaluator import evaluate_password
from logic.generator import generate_password

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    password = data.get('password', '')
    result = evaluate_password(password)
    return jsonify(result)

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    length = int(data.get('length', 16))
    use_upper = data.get('use_upper', True)
    use_numbers = data.get('use_numbers', True)
    use_symbols = data.get('use_symbols', True)
    
    pwd = generate_password(length, use_upper, use_numbers, use_symbols)
    return jsonify({"password": pwd})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
