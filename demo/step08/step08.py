#!/usr/bin/env python
# coding: utf8

from flask import Flask, jsonify, redirect, request, abort, g
import sqlite3
import sys
from task import Task

# special characters (e.g. üäö ...) work now
reload(sys)
sys.setdefaultencoding('utf-8')

# tell the front end which version we are currently running.
response = {
    'version': '08'
}

# have some predefined samples
myTasks = [
    Task('Play foosball', id="001"),
    Task('Catch \'em all', id="002", status=Task.NORMAL),
    Task('Learn to code', id="003", status=Task.COMPLETED)
]


# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

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
        cur.execute('select * from tasks')
        return [Task.fromDict(dict_from_row(row)) for row in cur]

def db_get_task(id):
    ''' Queries the db for a task with the specified id'''
    query = '''
        SELECT id, title, status
        FROM tasks
        WHERE id = ?;
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [id])
        return Task.fromDict(dict_from_row(cur.fetchone()))

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

def db_upate_task(task):
    ''' Updates a task and returns it '''
    query = '''
        UPDATE tasks
        SET title = ? , status =  ?
        WHERE id = ?;
    '''.format()

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [task.title, task.status, task.id])
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

# --------------------------
# -----     ROUTES     -----
# --------------------------

# serve static files
@app.route('/')
def frontEnd():
    return redirect("/index.html", code=302)

# INDEX ROUTE
@app.route('/api/tasks')
def get_tasks():
    response['data'] = [t.__dict__ for t in db_get_tasks()]
    return jsonify(response)

# CREATE ROUTE
@app.route('/api/tasks', methods=['POST'])
def create_task():
    title = request.json['title']
    newTask = db_create_task(title)
    if newTask == None:
        abort(500)
    return jsonify(newTask.__dict__)

# UPDATE ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['PUT'])
def update_task(task_id):
    print task_id
    task = db_get_task(task_id)
    if task == None:
        abort(404)
    task.setTitle(request.json['title'])
    task.setStatus(request.json['status'])

    task = db_upate_task(task)
    if task == None:
        abort(500)
    return jsonify(task.__dict__)

# DESTROY ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['DELETE'])
def remove_task(task_id):
    db_delete_task(task_id)
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int('20008'), debug=True)
