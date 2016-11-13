from utils import *

from server import app
from server.models import List

# --------------------------------------------
# IMPORTANT! NO ACCESS CONTROL IS DONE IN HERE
# --------------------------------------------

def db_has_access_to_list(list_id, user_id):
    ''' Returns whether a user has access to a certain list'''
    query = '''
        SELECT DISTINCT lists.id AS id
        FROM lists, collaborators
        WHERE list_id = ?
            AND (owner = ?
                OR (lists.id = collaborators.list_id
                   AND collaborators.user_id = ?)
            );
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [list_id, user_id, user_id])
        result = dict_from_row(cur.fetchone())
        return result.get('id') != None
    return False


def db_create_list(title, owner_id, inbox=False):
    ''' Creates a new user, if it does not exist yet'''
    query = '''
        INSERT INTO Lists(title, owner, inbox, revision)
        VALUES (?,?,?,1);
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [title, owner_id, 1 if inbox else 0])
        db.commit()
        return True
    return False


def db_get_lists(user_id):
    ''' Queries the db for a specific lists'''
    query = '''
        SELECT DISTINCT lists.id, lists.title, lists.owner, lists.revision, lists.inbox
        FROM lists LEFT OUTER JOIN collaborators ON lists.id = collaborators.list_id
        WHERE lists.owner = ? OR collaborators.user_id = ?
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [user_id, user_id])
        lists = []
        for row in cur:
            print dict_from_row(row)
            l = List.fromDict(dict_from_row(row))
            print l
            if isinstance(l, List):
                print "TRUE!!!"
                l.setCollaborators(db_get_collaborators_for_list(l.id))
                lists.append(l)
        return lists


def db_get_collaborators_for_list(list_id):
    ''' Returns a list of all collaborators for a list from the database '''
    query = '''
        SELECT user_id
        FROM Collaborators
        WHERE list_id = ?;
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [list_id])
        db.commit()
        return [dict_from_row(row)['user_id'] for row in cur]
