from server import app

# Return current version
@app.route('/api/version', methods=['GET'])
def get_version():
    return jsonify({'version': app.config['VERSION']})
