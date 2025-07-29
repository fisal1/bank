from flask import request, jsonify
import traceback
import asyncio
from services.rag_service import get_answer

def ask_controller():
    data = request.get_json()
    question = data.get('question')
    if not question:
        return jsonify({'error': 'question is required'}), 400

    try:
        answer, sources = asyncio.run(get_answer(question))
        return jsonify({'answer': answer, 'sources': sources}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
