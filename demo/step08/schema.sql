DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks(
    id      INTEGER      PRIMARY KEY AUTOINCREMENT,
    title   TEXT         NOT NULL,
    status  TEXT         NOT NULL
);

INSERT INTO Tasks(Title, Status) Values ('Eat an apple', 'normal');
INSERT INTO Tasks(Title, Status) Values ('Go for a run', 'normal');
INSERT INTO Tasks(Title, Status) Values ('Call grandma', 'completed');
