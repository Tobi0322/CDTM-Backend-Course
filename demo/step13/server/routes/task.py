from flask import request, jsonify, send_from_directory
from werkzeug import secure_filename

import os, shutil

from server import app
from server.database import *
from server.utils import login_required, allowed_file, list_access, json_abort

# INDEX ROUTE
@app.route('/api/lists/<string:list_id>/tasks', methods=['GET'])
@login_required
@list_access
def get_tasks(list_id):
    ''' get all tasks for a list '''
    response = {}
    response['tasks'] = [t.__dict__ for t in db_get_tasks_for_list(list_id)]
    return jsonify(response)

@app.route('/api/lists/<string:list_id>/tasks/<string:task_id>', methods=['GET'])
@login_required
@list_access
def get_task(list_id, task_id):
    ''' get a specific task '''
    task = db_get_task(list_id, task_id)
    if task == None:
        json_abort(404, 'Task not found')
    return jsonify(task.__dict__)

# CREATE ROUTE
@app.route('/api/lists/<string:list_id>/tasks', methods=['POST'])
@login_required
@list_access
def create_task(list_id):
    ''' creates a new task for a list '''
    data = request.get_json(force=True)
    title = data.get('title')
    if title == None:
        json_abort(400, 'Invalid request parameters')

    newTask = db_create_task(list_id, title)

    if newTask == None:
        json_abort(400, 'Could not create task')

    return jsonify(newTask.__dict__)

# UPDATE ROUTE
@app.route('/api/lists/<string:list_id>/tasks/<string:task_id>', methods=['PUT'])
@login_required
@list_access
def update_task(list_id, task_id):
    data = request.get_json(force=True)
    task = db_get_task(list_id, task_id)
    if task == None:
        json_abort(404, 'Task not found')

    # NOTE: Potential overflows are not being handled
    if data.get('revision') != None and data.get('revision') < task.revision:
        json_abort(409, 'Newer version of task available')

    # TODO: ignoring 'list' for now. Implement moving tasks from one list to another
    task.setTitle(data.get('title'))
    task.setStatus(data.get('status'))
    task.setDescription(data.get('description'))
    task.setDueDate(data.get('due'))
    task.setStarred(data.get('starred'))
    task.setRevision(task.revision + 1)

    task = db_update_task(list_id, task)
    if task == None:
        json_abort(500, 'Could not update task')

    return jsonify(task.__dict__)

# DESTROY ROUTE
@app.route('/api/lists/<string:list_id>/tasks/<string:task_id>', methods=['DELETE'])
@login_required
@list_access
def remove_task(list_id, task_id):
    # don't forget to delete all Uploads
    directory = os.path.join(app.config['UPLOAD_FOLDER'], list_id, task_id)
    print directory
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
    print directory, filename
    print app.root_path
    # return "Hello"
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
