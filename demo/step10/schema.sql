DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks(
    id          INTEGER      PRIMARY KEY AUTOINCREMENT,
    title       TEXT         NOT NULL,
    status      TEXT         NOT NULL,
    description TEXT         NOT NULL DEFAULT "",
    due         TIMESTAMP    ,
    created     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS Uploads;
CREATE TABLE Uploads(
  task        INTEGER      NOT NULL,
  filename    TEXT         NOT NULL,
  PRIMARY KEY (task, filename)
  FOREIGN KEY(task) REFERENCES Tasks(id)
);

DROP TABLE IF EXISTS User;
CREATE TABLE User(
  id          INTEGER      PRIMARY KEY AUTOINCREMENT,
  email       TEXT         NOT NULL UNIQUE,
  password    TEXT         NOT NULL
);


INSERT INTO Tasks(title, status, due) VALUES ('Go for a run', 'normal', '1970-01-01');
INSERT INTO Tasks(title, status, description) VALUES ('Eat an apple', 'normal', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)');
INSERT INTO Tasks(title, status, description) VALUES ('Call grandma', 'completed', 'Hey there! Don''t forget taking more notes... You know, small things are easy to forget :-)');

INSERT INTO Uploads (task, filename) VALUES (1, "test.png");
