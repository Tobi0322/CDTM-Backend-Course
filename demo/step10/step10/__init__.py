#!/usr/bin/env python
# coding: utf8

from flask import Flask, jsonify, redirect, request, abort, g, send_from_directory, session
from werkzeug import secure_filename, security
from functools import wraps
import sys, os, sqlite3, shutil


# special characters (e.g. üäö ...) work now
reload(sys)
sys.setdefaultencoding('utf-8')

# tell the front end which version we are currently running.
response = {
    'version': '10'
}

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

# import helper functions
from .utils import *
# import object models
from models import Task, User
# import database functions
from database import *
# import routes
import step10.routes

# --------------------------
# -----    DATABASE    -----
# --------------------------


def db_get_user(email):
    ''' Queries the db for a task with the specified id'''
    query = '''
        SELECT id, email, password
        FROM user
        WHERE email = ?;
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [email])
        user = User.fromDict(dict_from_row(cur.fetchone()))
        return user


def db_create_user(email, password):
    ''' Creates a new user, if it does not exist yet'''
    query = '''
        INSERT INTO User(email, password)
        VALUES (?,?);
    '''

    if db_get_user(email) != None:
        return False

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [email, password])
        db.commit()
        return True

def db_check_password(email, password):
    ''' Checks the password for the email and returns the respective user if they match'''
    user = db_get_user(email)
    if user != None and security.check_password_hash(user.password, password):
        return user
    return None


# --------------------------
# -----     ROUTES     -----
# --------------------------
# Return current version
@app.route('/api/version', methods=['GET'])
@login_required
def get_version():
    return jsonify(response)


# Authentication
# Register User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    email = data.get('email', '').lower()
    password = data.get('password')
    # TODO: properly check for email
    if email == None or (not isEmail(email)) or password == None or len(password) < 6:
        return jsonify({'result': False, 'text': 'Invalid username and/or password'})
    if db_create_user(email, security.generate_password_hash(password)):
        return jsonify({'result': True, 'text': 'User successfully created'})
    return jsonify({'result': False, 'text': 'User already exists'})

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
        return jsonify({'result': True, 'user': user.email})
    return jsonify({'result': False})

@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('userID', None)
    session.pop('userEmail', None)
    return jsonify({'result': True})

@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'result': True, 'user': session['userEmail']})
    else:
        return jsonify({'result': False})
