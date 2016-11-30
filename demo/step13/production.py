from waitress import serve
from run import *

init_app()
serve(app, host=config.HOST, port=int(config.PORT))
