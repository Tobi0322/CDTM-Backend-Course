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
    FOREIGN KEY(owner) REFERENCES Users(id)
);

DROP TABLE IF EXISTS Collaborators;
CREATE TABLE Collaborators(
  user_id          INTEGER      NOT NULL,
  list_id          INTEGER      NOT NULL,
  PRIMARY KEY (user_id, list_id),
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(list_id ) REFERENCES Lists(id)
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
    created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS Uploads;
CREATE TABLE Uploads(
  task        INTEGER      NOT NULL,
  filename    TEXT         NOT NULL,
  created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task, filename),
  FOREIGN KEY(task) REFERENCES Tasks(id)
);




-- INSERT INTO Tasks(title, status, due) VALUES ('Go for a run', 'normal', '1970-01-01');
-- INSERT INTO Tasks(title, status, description) VALUES ('Eat an apple', 'normal', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)');
-- INSERT INTO Tasks(title, status, description) VALUES ('Call grandma', 'completed', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)');
--
INSERT INTO Users (email, password) VALUES ('m@m.at', 'pbkdf2:sha1:1000$NuLD9IyO$8e6d1fb645f84814cb892e235ea44fdf3ecd8f33');
