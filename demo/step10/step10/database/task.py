import os

from utils import *

from step10 import app
from step10.models import Task


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
