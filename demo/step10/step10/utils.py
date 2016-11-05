from flask import session, abort
from functools import wraps
import re

from step10 import app

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            abort(401)
        return f(*args, **kwargs)
    return decorated_function

def isEmail(email):
    ''' returns whether a given string is a valid email address'''
    return re.match("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+.[a-zA-Z]{2,6}$", email) != None

def allowed_file(filename):
    ''' return whether it's an allowed type or not '''
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']
