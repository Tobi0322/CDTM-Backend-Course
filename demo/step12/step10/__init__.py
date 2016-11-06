#!/usr/bin/env python
# coding: utf8

from flask import Flask
import sys

# special characters (e.g. üäö ...) work now
reload(sys)
sys.setdefaultencoding('utf-8')

# set the project root directory as the static folder, you can set others. ä
app = Flask(__name__, static_url_path='')

# import routes
from routes import *
