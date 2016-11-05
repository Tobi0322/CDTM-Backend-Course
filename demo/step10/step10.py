#!/usr/bin/env python
# coding: utf8

from flask import Flask, jsonify, redirect, request, abort, g, send_from_directory, send_file, session
from werkzeug import secure_filename, security
from functools import wraps
import sys, os, sqlite3, shutil
from task import Task
from user import User

# special characters (e.g. üäö ...) work now
reload(sys)
sys.setdefaultencoding('utf-8')

# tell the front end which version we are currently running.
response = {
    'version': '10'
}

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

# config session parameters
app.secret_key = 'mostly awesome'
app.config['SESSION_TYPE'] = 'memchached'

# This is the path to the upload directory
app.config['UPLOAD_FOLDER'] = 'uploads/'
# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    ''' return whether it's an allowed type or not '''
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print "Helloe"
        if not session.get('logged_in'):
            abort(401)
        return f(*args, **kwargs)
    return decorated_function

# --------------------------
# -----    DATABASE    -----
# --------------------------

# make sure to use this  only within app.app_context()
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('task.db')
        db.row_factory = sqlite3.Row
    return db

def init_db():
    ''' Inititalizes the database '''
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def dict_from_row(row):
    ''' Converts a query result into a dict '''
    return {} if row == None else dict(zip(row.keys(), row))

def db_get_tasks():
    ''' Returns all tasks from the database '''
    with app.app_context():
        cur = get_db().cursor()
        cur.execute('select * from Tasks order by status desc, due asc')
        tasks = []
        for row in cur:
            task = Task.fromDict(dict_from_row(row))
            if isinstance(task, Task):
                task.setFiles(db_get_filenames_for_task(task.id))
                tasks.append(task)
        return tasks

def db_get_task(id):
    ''' Queries the db for a task with the specified id'''
    query = '''
        SELECT id, title, status, description, due
        FROM tasks
        WHERE id = ?;
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [id])
        task = Task.fromDict(dict_from_row(cur.fetchone()))
        if isinstance(task, Task):
            task.setFiles(db_get_filenames_for_task(task.id))
        return task


def db_create_task(title):
    ''' Inserts a new task and returns it '''
    query = '''
        INSERT INTO Tasks(title, status)
        Values (?, 'normal');
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [title])
        db.commit()

    return db_get_task(cur.lastrowid)

def db_update_task(task):
    ''' Updates a task and returns it '''
    query = '''
        UPDATE tasks
        SET title = ? , status =  ?, description = ?, due = ?
        WHERE id = ?;
    '''.format()

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [task.title, task.status, task.description, task.due, task.id])
        db.commit()

    return db_get_task(task.id)

def db_delete_task(id):
    ''' Deletes the task with the specified id '''
    query = '''
        DELETE
        FROM tasks
        WHERE id = ?;
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [id])
        db.commit()

def db_get_filenames_for_task(task_id):
    ''' Returns a list of all files for a tasks from the database '''
    query = '''
        SELECT filename
        FROM Uploads
        WHERE task = ?;
    '''.format()

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [task_id])
        db.commit()
        return [dict_from_row(row)['filename'] for row in cur]

def db_create_file(task_id, filename):
    ''' Inserts a new file '''

    query = '''
        INSERT OR REPLACE
        INTO Uploads(task, filename)
        Values (?, ?);
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [task_id, filename])
        db.commit()


def db_delete_file(task_id, filename):
    ''' Deletes the file with the task_id and filename '''
    query = '''
        DELETE
        FROM Uploads
        WHERE task = ? AND filename = ?;
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [task_id, filename])
        db.commit()

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

# serve static files
@app.route('/')
@app.route('/login/')
@app.route('/logout/')
@app.route('/register/')
@app.route('/home/')
def frontEnd():
    return send_file('static/index.html')

# INDEX ROUTE
@app.route('/api/tasks', methods=['GET'])
@login_required
def get_tasks():
    response['data'] = [t.__dict__ for t in db_get_tasks()]
    return jsonify(response)

# CREATE ROUTE
@app.route('/api/tasks', methods=['POST'])
@login_required
def create_task():
    data = request.get_json(force=True)
    title = data.get('title')
    if title == None:
        abort(400)

    newTask = db_create_task(title)

    if newTask == None:
        abort(500)
    return jsonify(newTask.__dict__)

# UPDATE ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    data = request.get_json(force=True)
    task = db_get_task(task_id)
    if task == None:
        abort(404)

    task.setTitle(data.get('title'))
    task.setStatus(data.get('status'))
    task.setDescription(data.get('description'))
    task.setDueDate(data.get('due'))

    task = db_update_task(task)
    if task == None:
        abort(500)

    return jsonify(task.__dict__)

# DESTROY ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['DELETE'])
@login_required
def remove_task(task_id):
    # don't forget to delete all Uploads
    directory = os.path.join(app.config['UPLOAD_FOLDER'], task_id)
    shutil.rmtree(directory, ignore_errors=True)

    db_delete_task(task_id)
    return jsonify({'result': True})

# UPLOAD FILES
@app.route('/api/tasks/<string:task_id>/files', methods=['POST'])
@login_required
def upload_file(task_id):
    # each file is save in a folder named after the corresponding tasks id
    directory = os.path.join(app.config['UPLOAD_FOLDER'], task_id)
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Get the name of the uploaded files
    uploaded_files = request.files.getlist('files[]')
    for file in uploaded_files:
        if file and allowed_file(file.filename):
            # sanitize the filename
            filename = secure_filename(file.filename)
            # save uploaded file permanently
            file.save(os.path.join(directory, filename))
            # save reference in database
            db_create_file(task_id, filename)

    # return the updated task
    task = db_get_task(task_id)
    if task == None:
        abort(500)

    return jsonify(task.__dict__)

# GET FILE
@app.route('/api/tasks/<string:task_id>/files/<string:filename>', methods=['GET'])
@login_required
def get_file(task_id, filename):
    directory = os.path.join(app.config['UPLOAD_FOLDER'], task_id)
    return send_from_directory(directory, filename)


# REMOVE FILE
@app.route('/api/tasks/<string:task_id>/files/<string:filename>', methods=['DELETE'])
@login_required
def remove_file(task_id, filename):
    db_delete_file(task_id, filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], task_id, filename)
    if os.path.exists(filepath) and os.path.isfile(filepath):
        os.remove(filepath)
    return jsonify({'result': True})


# Authentication
# Register User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    email = data.get('email', '').lower()
    password = data.get('password')
    # TODO: properly check for email
    if email == None or email == '' or password == None or len(password) < 6:
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
@login_required
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


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int('20010'), debug=True)
