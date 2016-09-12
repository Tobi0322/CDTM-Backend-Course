from flask import Flask


app = Flask(__name__)

# say hello
@app.route('/')
def hello_world():
    return 'Hello World!'

# will trigger an error
@app.route('/err')
def err():
    assert app.debug == False
    return 'Oops!'


if __name__ == '__main__':
    addr = "localhost"         # the same as 127.0.0.1
    port = int("20000")        # between 3000 and 65535
    debug = True               # activates the [1] debugger, [2] automatic reloader
    app.run(host=addr, port=port, debug=debug)
