from flask import send_file
from server import app

# serve static files
@app.route('/')
@app.route('/login/')
@app.route('/logout/')
@app.route('/register/')
@app.route('/home/')
def frontEnd():
    return send_file('static/index.html')
