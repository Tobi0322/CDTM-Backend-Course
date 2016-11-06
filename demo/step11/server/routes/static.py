from flask import send_file
from server import app

# serve static files
@app.route('/')
@app.route('/register/')
def frontEnd():
    return send_file('static/index.html')
