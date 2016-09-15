from flask import json

class Task:
    """Represents one Todo-Item"""

    NORMAL = 'normal'
    COMPLETED = 'completed'

    def __init__(self, title, status = NORMAL):
        self.title =  title
        self.status = status