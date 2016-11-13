from flask import request, jsonify, session

from server import app
from server.database import *
from server.utils import login_required, list_access

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


@app.route('/api/lists/<string:list_id>', methods=['DELETE'])
@login_required
@list_access
def remove_list(list_id):
    # delete respective file directory
    directory = os.path.join(app.config['UPLOAD_FOLDER'], list_id)
    shutil.rmtree(directory, ignore_errors=True)

    db_delete_list(list_id)
    return jsonify({'result': True})
