from flask import jsonify

from step10 import app
from step10.utils import login_required

# import all the routes
from static import *
from task import *
from auth import *

# Return current version
@app.route('/api/version', methods=['GET'])
@login_required
def get_version():
    return jsonify({'version': app.config['VERSION']})
