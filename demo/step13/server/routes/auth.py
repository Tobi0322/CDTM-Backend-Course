from flask import request, session, jsonify
from werkzeug import security

from server import app
from server.database import *
from server.utils import login_required, isEmail

# return session state
@app.route('/api/status')
def status():
    if session.get('logged_in'):
        return jsonify({'result': True})
    else:
        return jsonify({'result': False})

# register User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    email = data.get('email', '').lower()
    password = data.get('password')
    if email == None or (not isEmail(email)) or password == None or len(password) < 6:
        return jsonify({'result': False, 'text': 'Invalid username and/or password'})
    if db_create_user(email, security.generate_password_hash(password)):
        # TODO: get User here
        #if db_create_list('Inbox', user_id, inbox=True):
            return jsonify({'result': True, 'text': 'User successfully created'})
        # else revert ?
    return jsonify({'result': False, 'text': 'User already exists'})

# login User
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    email = data.get('email', '').lower()
    password = data.get('password')

    user = db_check_password(email, password)
    if user != None:
        session['logged_in'] = True
        session['userID'] = user.id
        session['userEmail'] = user.email
        return jsonify({'result': True})
    return jsonify({'result': False})

# logout User
@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('userID', None)
    session.pop('userEmail', None)
    return jsonify({'result': True})
