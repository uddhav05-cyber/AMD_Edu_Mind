from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow cross‑origin requests from the frontend

# Simple health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

# Example data endpoint
@app.route('/api/hello', methods=['GET'])
def say_hello():
    name = request.args.get('name', 'world')
    return jsonify({'message': f'Hello, {name}!'} )

# Simple in-memory "notes" storage to demonstrate CRUD operations
_notes = []
_next_id = 1

@app.route('/api/notes', methods=['GET'])
def list_notes():
    return jsonify(_notes)

@app.route('/api/notes', methods=['POST'])
def create_note():
    global _next_id
    data = request.get_json() or {}
    note = {
        'id': _next_id,
        'text': data.get('text', '')
    }
    _notes.append(note)
    _next_id += 1
    return jsonify(note), 201

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global _notes
    _notes = [n for n in _notes if n['id'] != note_id]
    return '', 204

if __name__ == '__main__':
    # development server; use gunicorn or similar in production
    app.run(host='0.0.0.0', port=5000, debug=True)
