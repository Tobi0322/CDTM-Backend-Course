from flask import json

class Task:
    """Represents one Todo-Item"""

    NORMAL = 'normal'
    COMPLETED = 'completed'

    def __init__(self, title, id="", status = NORMAL):
        self.id = id
        self.title =  title
        self.status = status

    def setTitle(self, title):
        self.title = title

    def setStatus(self, status):
        if status == self.COMPLETED:
            self.status = self.COMPLETED
        else:
            self.status = self.NORMAL
