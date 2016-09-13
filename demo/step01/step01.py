from flask import Flask, render_template, jsonify

# create a new app
app = Flask(__name__)

# returns a string
@app.route('/')
def hello_world():
    return 'Hello World!'

# returns an html template
@app.route('/html')
def demo_html():
    return render_template('hello.html')

# returns some json
@app.route('/json')
def demo_json():
    centerling = {
        "name": "Michael",
        "class": "Spring 2016",
        "courses": {
            "trend": "Fighting Hunger",
            "mpd": "Counting Cells",
            "elab": "",
            "electives": [
                "Autonomous Drones",
                "Neuroscience",
                "Self Leadership"
            ]
        }
    }
    return jsonify(centerling)

# this will trigger an error
@app.route('/err')
def err():
    assert app.debug == False
    return 'Oops!'


if __name__ == '__main__':
    addr = "localhost"         # the same as 127.0.0.1
    port = int("20000")        # between 3000 and 65535
    debug = True               # activates the [1] debugger, [2] automatic reloader
    app.run(host=addr, port=port, debug=debug)
