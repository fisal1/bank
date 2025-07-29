import os
import asyncio
from flask import request, jsonify
from services.document_parser import extract_text_from_file
from services.chunk_utils import chunk_text
from services.vector_service import save_chunks

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

def upload_controller():
    file = request.files.get('file')
    tag = request.form.get('tag')
    version = request.form.get('version')
    if not file or not tag or not version:
        return jsonify({'error': 'file, tag, and version are required'}), 400

    filename = file.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    text = extract_text_from_file(file_path)
    chunks = chunk_text(text)

    asyncio.run(save_chunks(chunks, tag, version, filename))

    return jsonify({'message': 'Uploaded and processed', 'chunks': len(chunks)}), 200
