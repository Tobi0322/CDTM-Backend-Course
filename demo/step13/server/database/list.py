from utils import *
from user import db_get_user_by_id

from server import app
from server.models import List


# --------------------------------------------
# IMPORTANT! NO ACCESS CONTROL IS DONE IN HERE
# --------------------------------------------

def db_has_access_to_list(list_id, user_id):
    ''' Returns whether a user has access to a certain list'''
    query = '''
        SELECT DISTINCT lists.id AS id
        FROM lists LEFT OUTER JOIN collaborators ON lists.id = collaborators.list_id
        WHERE lists.id = ?
            AND (lists.owner = ? OR collaborators.user_id = ?)
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
        return db_get_list(cur.lastrowid)


def db_get_lists(user_id):
    ''' Queries the db for all lists associated with the user_id'''
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
            l = List.fromDict(dict_from_row(row))
            if isinstance(l, List):
                l.setCollaborators(db_get_collaborators_for_list(l.id))
                lists.append(l)
        return lists

def db_get_list(list_id):
    ''' Queries the db for a specific list'''
    query = '''
        SELECT id, title, owner, revision, inbox
        FROM lists
        WHERE id = ?
    '''

    with app.app_context():
        cur = get_db().cursor()
        cur.execute(query, [list_id])
        l = List.fromDict(dict_from_row(cur.fetchone()))
        if isinstance(l, List):
            l.setCollaborators(db_get_collaborators_for_list(l.id))
        return l

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


def db_update_list(l):
    ''' Updates a list and returns it '''
    query = '''
        UPDATE lists
        SET title = ?, revision = ?
        WHERE id = ?;
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [l.title, l.revision, l.id])
        db.commit()

    db_update_collaborators(l.id, l.collaborators)

    return db_get_list(l.id)


def db_update_collaborators(list_id, collaborators):
    ''' Updates the collaborators of a list '''
    queries = []
    queries.append(('''
        DELETE FROM collaborators WHERE list_id = ?;
    ''', [list_id]))

    # list(set()) remove duplicates
    for collaborator in list(set(collaborators)):
        if db_get_user_by_id(collaborator) != None:
            queries.append(('INSERT INTO collaborators(list_id, user_id) VALUES (?,?);', [list_id, collaborator]))

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        for query, params in queries:
            cur.execute(query, params)
        db.commit()



def db_delete_list(id):
    ''' Deletes the list and all it's tasks with the specified id '''
    query = '''
        DELETE FROM lists WHERE id = ?;
    '''

    with app.app_context():
        db = get_db()
        cur = db.cursor()
        cur.execute(query, [id])
        db.commit()
