class Task:
    '''Represents one Todo-Item'''

    NORMAL = 'normal'
    COMPLETED = 'completed'

    @staticmethod
    def fromDict(dict):
        try:
            task = Task(
                dict['title'],
                dict['list'],
                id = dict['id'],
                description = dict['description'],
                due = dict['due'],
                starred = dict['starred'] != 0,
                revision = int(dict['revision'])
            )
            task.setStatus(dict['status'])
            return task
        except Exception as e:
            return None


    def __init__(self, title, list, id='', status = NORMAL, description = '', due = '', starred=False, revision=1):
        self.id = id
        self.list = list
        self.title =  title
        self.status = status
        self.description = description
        self.due = due
        self.revision = revision
        self.starred = starred
        self.files = []

    def setTitle(self, title):
        if title == None or title == '':
            return
        self.title = title

    def setStatus(self, status):
        if status == None or status == '':
            return
        if status == self.COMPLETED:
            self.status = self.COMPLETED
        else:
            self.status = self.NORMAL

    def setDescription(self, description):
        if description == None:
            return
        self.description = description

    def setList(self, list):
        if list == None:
            return
        self.list = list

    def setRevision(self, revision):
        if revision == None:
            return
        self.revision = revision

    def setStarred(self, starred):
        if starred == None:
            return
        self.starred = starred

    def setDueDate(self, dueDate):
        if dueDate == None or dueDate == '':
            self.dueDate = ''
        self.due = dueDate

    def setFiles(self, files):
        self.files = files
