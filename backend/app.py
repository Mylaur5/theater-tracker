from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to store the uploaded files
UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
	os.makedirs(UPLOAD_FOLDER)


# Route to serve the season data
@app.route('/seasons', methods=['GET'])
def get_seasons():
	file_path = os.path.join(os.path.dirname(__file__), 'data',
		'seasons_data_version_5.1.json')
	if not os.path.exists(file_path):
		return jsonify({"error": "File not found"}), 404
	with open(file_path, 'r') as f:
		data = json.load(f)
	return jsonify(data)


# Route to serve images from the 'backend/images' folder
@app.route('/images/<path:filename>', methods=['GET'])
def serve_image(filename):
	image_folder = os.path.join(app.root_path, 'images')
	return send_from_directory(image_folder, filename)


# Route to handle file uploads
@app.route('/uploads', methods=['POST'])
def upload_file():
	if 'file' not in request.files:
		return jsonify({"error": "No file part"}), 400
	file = request.files['file']
	if file.filename == '':
		return jsonify({"error": "No selected file"}), 400
	if file:
		filename = secure_filename(file.filename)
		file_path = os.path.join(UPLOAD_FOLDER, filename)
		file.save(file_path)
		return jsonify({
			"message": "File uploaded successfully",
			"filename": filename
		}), 200


# Route to list all uploaded files
@app.route('/uploads', methods=['GET'])
def list_uploaded_files():
	files = os.listdir(UPLOAD_FOLDER)
	return jsonify(files)


# Route to get the uploaded file data
@app.route('/characters', methods=['GET'])
def get_characters():
	filename = request.args.get('filename')
	if not filename:
		return jsonify({"error": "Filename not provided"}), 400
	file_path = os.path.join(UPLOAD_FOLDER, filename)
	if not os.path.exists(file_path):
		return jsonify({"error": "File not found"}), 404
	with open(file_path, 'r') as f:
		data = json.load(f)
	return jsonify(data)


if __name__ == '__main__':
	# Make sure images folder exists
	if not os.path.exists(os.path.join(app.root_path, 'images')):
		os.makedirs(os.path.join(app.root_path, 'images'))
	app.run(debug=True, port=5000)
