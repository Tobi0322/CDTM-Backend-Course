PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Users;
CREATE TABLE Users(
  id          INTEGER      PRIMARY KEY AUTOINCREMENT,
  email       TEXT         NOT NULL UNIQUE,
  password    TEXT         NOT NULL,
  created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Lists;
CREATE TABLE Lists(
    id          INTEGER      PRIMARY KEY AUTOINCREMENT,
    owner       INTEGER      NOT NULL,
    title       TEXT         NOT NULL,
    revision    INTEGER      NOT NULL DEFAULT 1,
    inbox       INTEGER      NOT NULL DEFAULT 0,
    created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner) REFERENCES Users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Collaborators;
CREATE TABLE Collaborators(
  user_id          INTEGER      NOT NULL,
  list_id          INTEGER      NOT NULL,
  PRIMARY KEY (user_id, list_id),
  FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY(list_id ) REFERENCES Lists(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks(
    id          INTEGER      PRIMARY KEY AUTOINCREMENT,
    list        INTEGER      NOT NULL,
    title       TEXT         NOT NULL,
    status      TEXT         NOT NULL,
    description TEXT         NOT NULL DEFAULT '',
    due         TIMESTAMP    ,
    starred     INTEGER      NOT NULL DEFAULT 0,
    revision    INTEGER      NOT NULL DEFAULT 1,
    created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(list) REFERENCES Lists(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS Uploads;
CREATE TABLE Uploads(
  task        INTEGER      NOT NULL,
  filename    TEXT         NOT NULL,
  created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task, filename),
  FOREIGN KEY(task) REFERENCES Tasks(id) ON DELETE CASCADE
);


INSERT INTO Users (email, password) VALUES ('m1@m.at', 'pbkdf2:sha1:1000$gCsMmQsW$223df524b63a836a3c2c52ad177ffa08c3094b8d');
INSERT INTO Users (email, password) VALUES ('m2@m.at', 'pbkdf2:sha1:1000$gCsMmQsW$223df524b63a836a3c2c52ad177ffa08c3094b8d');
INSERT INTO Lists (title, owner, revision, inbox) VALUES ('Inbox', 1, 1, 1);
INSERT INTO Lists (title, owner, revision, inbox) VALUES ('Groceries', 1, 1, 0);
INSERT INTO Lists (title, owner, revision, inbox) VALUES ('test2', 2, 1, 0);
INSERT INTO Collaborators (list_id, user_id) VALUES (1, 2);
INSERT INTO Tasks(title, list, status, due, starred, revision) VALUES ('Go for a run', 1,  'normal', '1970-01-01', 0, 1);
INSERT INTO Tasks(title, list, status, description, starred, revision) VALUES ('Eat an apple', 1, 'normal', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)', 0, 1);
INSERT INTO Tasks(title, list, status, description, starred, revision) VALUES ('Call grandma', 2, 'completed', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)', 1, 1);
INSERT INTO Uploads (task, filename) VALUES (1, 'tets.jpg');
