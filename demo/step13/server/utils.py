from flask import session, abort, jsonify, make_response
from functools import wraps
import re

from server import app
from server.database import *

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            json_abort(401, 'Login required')
        return f(*args, **kwargs)
    return decorated_function

def list_access(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        list_id = kwargs.get('list_id')
        if not db_has_access_to_list(list_id, session.get('userID')):
            json_abort(404, 'List not found')
        return f(*args, **kwargs)
    return decorated_function

def isEmail(email):
    ''' returns whether a given string is a valid email address'''
    return re.match("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+.[a-zA-Z]{2,6}$", email) != None

def allowed_file(filename):
    ''' return whether it's an allowed type or not '''
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

def json_abort(code, text):
    json = {
        'result': False,
        'error': {
            'status': code,
            'text': text
        }
    }
    abort(make_response(jsonify(json), code))
