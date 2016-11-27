from flask import request, jsonify, session

import os, shutil

from server import app
from server.database import *
from server.utils import login_required, list_access, list_owner, json_abort

@app.route('/api/lists', methods=['GET'])
@login_required
def get_lists():
    ''' returns all lists a user has access to '''
    response = {}
    response['lists'] = [l.__dict__ for l in db_get_lists(session.get('userID'))]
    return jsonify(response)


@app.route('/api/lists/<string:list_id>', methods=['GET'])
@login_required
@list_access
def get_list(list_id):
    ''' returns the specified list'''
    l = db_get_list(list_id)
    if l == None:
        json_abort(404, "List not found")
    return jsonify(l.__dict__)


@app.route('/api/lists/', methods=['POST'])
@login_required
def create_list():
    ''' creates a new list '''
    data = request.get_json(force=True)
    title = data.get('title')

    newList = db_create_list(title, session.get('userID'))
    if newList == None:
        json_abort(500, 'Could not create list')

    return jsonify(newList.__dict__), 201

@app.route('/api/lists/<string:list_id>', methods=['PUT'])
@login_required
@list_owner
def update_list(list_id):
    data = request.get_json(force=True)
    l = db_get_list(list_id)
    if task == None:
        json_abort(404, 'List not found')
    # NOTE: Potential overflows are not being handled
    if data.get('revision') != None and data.get('revision') < l.revision:
        json_abort(409, 'Newer version of list available')

    l.title = (data.get('title'))
    l.revision = l.revision + 1

    l = db_update_list(l)
    if l == None:
        json_abort(500, 'Could not update list')

    return jsonify(l.__dict__)

@app.route('/api/lists/<string:list_id>', methods=['DELETE'])
@login_required
@list_owner
def remove_list(list_id):
    # delete respective file directory
    directory = os.path.join(app.config['UPLOAD_FOLDER'], list_id)
    shutil.rmtree(directory, ignore_errors=True)

    db_delete_list(list_id)
    return jsonify({'result': True})
