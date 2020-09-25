CREATE TABLE users (
    username varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    active boolean NOT NULL DEFAULT true
);

INSERT INTO users VALUES('test', 'test');
INSERT INTO users VALUES('test2', 'test', false);
INSERT INTO users VALUES('deleted_foo', 'test', true);

/* This should fail */
INSERT INTO users VALUES('deleted_foo2', 'test', null);
