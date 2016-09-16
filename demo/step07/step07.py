from flask import Flask, jsonify, redirect, request, abort, g
import sqlite3
from task import Task

# tell the front end which version we are currently running.
response = {
    'version': '06'
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
    return dict(zip(row.keys(), row))

def db_get_tasks():
    ''' Returns all tasks from the database '''
    with app.app_context():
        cur = get_db().cursor()
        cur.execute('select * from tasks')
        return [Task.fromDict(dict_from_row(row)) for row in cur]

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
    newTask = Task(title, id="{0:0>3}".format(len(myTasks)+1))
    myTasks.append(newTask)
    return jsonify(newTask.__dict__)

# UPDATE ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['PUT'])
def update_task(task_id):
    task = [task for task in myTasks if task.id == task_id]
    print task
    if len(task) == 0:
        abort(404)
    task[0].setTitle(request.json['title'])
    task[0].setStatus(request.json['status'])
    return jsonify(task[0].__dict__)


# DESTROY ROUTE
@app.route('/api/tasks/<string:task_id>', methods=['DELETE'])
def remove_task(task_id):
    task = [task for task in myTasks if task.id == task_id]
    if len(task) == 0:
        abort(404)
    myTasks.remove(task[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int('20006'), debug=True)
