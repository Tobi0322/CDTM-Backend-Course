from flask import request, jsonify

from server import app
from server.database import *
from server.utils import login_required, list_access

@app.route('/api/lists', methods=['GET'])
@login_required
def get_lists():
    ''' return all lists a user has access to '''
    response = {}
    # TODO: return lists
    # response['lists'] = [t.__dict__ for t in db_get_lists()]
    return jsonify(response)

@app.route('/api/lists/<string:list_id>', methods=['GET'])
@login_required
@list_access
def get_list(list_id):
    ''' return the specific list'''
    response = {}
    # TODO: return lists
    # response['lists'] = [t.__dict__ for t in db_get_lists()]
    return jsonify(response)
