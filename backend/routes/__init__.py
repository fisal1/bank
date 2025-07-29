from flask import Blueprint
from controllers.upload_controller import upload_controller
from controllers.ask_controller import ask_controller

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')
ask_bp = Blueprint('ask', __name__, url_prefix='/api/ask')

upload_bp.add_url_rule('/', 'upload', upload_controller, methods=['POST'])
ask_bp.add_url_rule('/', 'ask', ask_controller, methods=['POST'])
