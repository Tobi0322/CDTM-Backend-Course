from flask import request, jsonify
import os, shutil

from server import app
from server.database import *
from server.utils import login_required, list_owner, json_abort

@app.route('/api/lists/<string:list_id>/collaborators/<string:collaborator_id>', methods=['POST'])
@login_required
@list_owner
def add_collaborator(list_id, task_id, collaborator_id):
    if db_get_user_by_id(collaborator_id) == None:
        json_abort(400, 'Invalid request parameters')

    l = db_get_list(list_id)
    if l == None:
        json_abort(500, 'Could not update list')

    return jsonify(l.__dict__)


# REMOVE FILE
@app.route('/api/lists/<string:list_id>/collaborators/<string:collaborator_id>', methods=['DELETE'])
@login_required
@list_access
def remove_file(list_id, collaborator_id):
    if db_get_user_by_id(collaborator_id) == None:
        json_abort(400, 'Invalid request parameters')

    db_remove_collaborator(list_id, collaborator_id)
    return jsonify({'result': True})
