-- Notes for PostgreSQL Database (9.6)
-- https://www.postgresql.org/docs/9.6/static/index.html

-- Data Types
-- https://www.postgresql.org/docs/9.6/static/datatype.html

/*

CHAR          Fixed length and space padded character string (sql: CHAR)
VARCHAR       Variable length character string (sql: VARCHAR)
TEXT          Variable length character large string (sql: TEXT)

INT           Declare integer number (sql: INT 32 bits)
SMALLINT      16 bits
BIGINT        64 bits
SERIAL        Auto increment integer (INT with sequence)

REAL             Declare floating-point number 32 bits
DOUBLE PRECISION Declare floating-point number 64 bits

NUMERIC(p,s)     Declare fixed-point number (sql: NUMERIC)

DATE          Declare date
TIME          Declare time
TIMESTAMP     Declare datetime
TIMESTAMP WITH TIMEZONE or TIMESTAMPTZ
              Declare datetime as timezone aware (stored as UTC but convert to client session timezone)
INTERVAL      Declare period of time difference

BYTEA         Binary data

 */
-- test table
create table test(
  id       serial primary key,
  ts       timestamptz default current_timestamp,
  cat      varchar(10),

  price    numeric(19,4),
  qty      int,

  txtdata  text,
  bindata  bytea,

  distx    real,
  disty    double precision
);
insert into test(cat, price, qty) values ('test', 100000.10, 50000),
                                         ('test', 100000.20, 0),
                                         ('test', 100000.00, 1),
                                         ('test', 9977000.3333, 179),
                                         ('test', 104729.1129, 104729);
insert into test(cat, bindata, txtdata) values ('test2', E'\\xCAFEBABE', 'CAFEBABE');
insert into test(cat, bindata) values ('test3', decode(md5(random()::text), 'hex'));
insert into test(cat, bindata) values ('test3', decode(md5(random()::text), 'hex'));
insert into test(cat, bindata) values ('test3', decode(md5(random()::text), 'hex'));
update test set txtdata = encode(bindata, 'hex') where cat = 'test3';
insert into test(cat, distx, disty) values ('test4', random(), random());
insert into test(cat, distx, disty) values ('test4', random(), random());
insert into test(cat, distx, disty) values ('test4', random(), random());
select sum(price) from test where cat = 'test';
select * from test order by cat, ts desc;
