from utils import *

from server import app
from server.models import User


def db_get_user(email):
    ''' Queries the db for a task with the specified id'''
    query = '''
        SELECT id, email, password
        FROM user
        WHERE email = ?;
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [email])
        user = User.fromDict(dict_from_row(cur.fetchone()))
        return user


def db_create_user(email, password):
    ''' Creates a new user, if it does not exist yet'''
    query = '''
        INSERT INTO User(email, password)
        VALUES (?,?);
    '''

    if db_get_user(email) != None:
        return False

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [email, password])
        db.commit()
        return True
