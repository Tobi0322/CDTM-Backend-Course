from flask import request, jsonify
from werkzeug import security

from server import app
from server.database import *
from server.utils import isEmail

# register User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    email = data.get('email', '').lower()
    password = data.get('password')
    if email == None or (not isEmail(email)) or password == None or len(password) < 6:
        return jsonify({'result': False, 'text': 'Invalid username and/or password'})
    if db_create_user(email, security.generate_password_hash(password)):
        return jsonify({'result': True, 'text': 'User successfully created'})
    return jsonify({'result': False, 'text': 'User already exists'})
