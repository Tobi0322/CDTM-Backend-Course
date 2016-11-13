class List:
    '''Represents one List'''

    @staticmethod
    def fromDict(dict):
        try:
            user = User(
                dict['title'],
                dict['owner'],
                id = dict['id'],
                revision = int(dict['revision']),
                inbox = dict['inbox']
            )
            return user
        except Exception as e:
            return None


    def __init__(self, title, owner, id='', revision=1, inbox=''):
        self.id = id
        self.title =  title
        self.owner = owner
        self.inbox = inbox
        self.revision = revision
        self.collaborators = []


    def setCollaborators(self, collaborators):
        self.collaborators = collaborators
