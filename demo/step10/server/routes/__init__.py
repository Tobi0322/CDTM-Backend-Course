from flask import jsonify

from server import app

# import all the routes
from static import *
from task import *

# Return current version
@app.route('/api/version', methods=['GET'])
def get_version():
    return jsonify({'version': app.config['VERSION']})
