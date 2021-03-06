from flask import Flask, jsonify, redirect, request
from task import Task

#tell the front end which version we are currently running.
response = {
    'version': '03'
}

# have some predefined samples
myTasks = [
    Task('Play foosball'),
    Task('Catch \'em all', status=Task.NORMAL),
    Task('Learn to code', status=Task.COMPLETED)
]

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

# serve static files
@app.route('/')
def frontEnd():
    return redirect("/index.html", code=302)

# INDEX ROUTE
@app.route('/api/tasks')
def get_tasks():
    response['data'] = [t.__dict__ for t in myTasks]
    return jsonify(response)

# CREATE ROUTE
@app.route('/api/tasks', methods=['POST'])
def create_task():
    title = request.json['title']
    newTask = Task(title)
    myTasks.append(newTask)
    return jsonify(newTask.__dict__)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int('20003'), debug=True)
