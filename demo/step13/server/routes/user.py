from flask import session, jsonify

from server import app
from server.database import *
from server.utils import login_required, json_abort

@app.route('/api/user', methods=['GET'])
@login_required
def get_user():
    return jsonify({
        'id': session.get('userID'),
        'email': session.get('userEmail')
    })

@app.route('/api/users/<string:id>', methods=['GET'])
@login_required
def get_user_by_id(id):
    user = db_get_user_by_id(id)
    if user == None:
        json_abort(404, "User not found.")

    return jsonify({
        'id': user.id,
        'email': user.email
    })
