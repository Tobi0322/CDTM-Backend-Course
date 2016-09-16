from flask import json

class Task:
    '''Represents one Todo-Item'''

    NORMAL = 'normal'
    COMPLETED = 'completed'

    @staticmethod
    def fromDict(dict):
        try:
            task = Task(
                dict['title'],
                id = dict['id'],
                description = dict['description']
            )
            task.setStatus(dict['status'])
            return task
        except Exception as e:
            return None


    def __init__(self, title, id='', status = NORMAL, description = '', due = ''):
        self.id = id
        self.title =  title
        self.status = status
        self.description = description
        self.due = due

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
        if description == None or description == '':
            return
        self.description = description
