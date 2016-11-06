import os

from server import *
import config

if __name__ == '__main__':

    if config.DB_SEED:
        init_db()

    app.config['VERSION'] = config.VERSION

    app.config['UPLOAD_FOLDER'] =  os.path.join(app.root_path, '..', config.UPLOAD_FOLDER)
    app.config['ALLOWED_EXTENSIONS'] = set(config.ALLOWED_EXTENSIONS)

    app.run(host=config.HOST, port=int(config.PORT), debug=True)
