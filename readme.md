# About PostgreSQL

https://www.postgresql.org/

## PostgreSQL

https://www.postgresql.org/


## Install and Setup (on MacOS)

To install:

    bash> brew install postgresql

Startup server:
    
    bash> pg_ctl -D /usr/local/var/postgres start

To stop it:

    bash> pg_ctl -D /usr/local/var/postgres stop

Or you can define PGDATA env:

    bash> export PGDATA=/usr/local/var/postgres
    bash> pg_ctl start

## Verify First DB

A default database named 'postgres' should already exists, along with a 'postgres' DB user:

    bash> psql -U postgres postgres
    # Now test a query
    postgres=# select version();
    # To exit
    postgres=# \q
    
NOTE: The default DB user 'postgres' is usually a DB superuser that has all the privileges to
perform all operations! 
    
## Understanding System user, DB user and DB instance

You should know the difference between these:
 
- System user   The user you used to login into your workstation system
- DB user       The DB user that used to connect to DB and assign DB privileges
- DB name       The DB instance that holds your tables and other data

A typical default setup for PostgreSQL is to create a System user that has same name as the DB user. Since
a default database name 'postgres' and DB user 'postgres' is often automatically created, we often
create a special System user account named 'postgres' to start the DB server process as well.

However, a normal system user may setup similar way that match to a DB user, and create a DB with same name. 
If we do this then the 'psql' client can be started without any extra arguments. Because the 'psql' has the
following default:

    bash> psql -U <current_user_name> <current_user_name>

So for a system user 'zemian' who logged in to a terminal, the following will connect to 'zemian' DB:
    
    bash> psql
    
    # Now verify current connected user
    zemian=# select current_user;
    
## Create A New DB User

To create a super user same name as your own system user:

    bash> createuser -s `whoami`  # The "-s" option is for creating superuser.
    
To create a normal app DB user (it should prompt you for password):

    bash> createuser -W mydb
    
To remove the DB user:

    bash> dropuser mydb
    
To change DB user password (you need to login as a superuser first):

    bash> psql -U postgres postgres
    postgres=# \password mydb

## Create A New DB:

NOTE: You should create a new DB user before a new DB, so that the DB user can be used as the DB owner!

Connect to DB with 'postgres' as superuser, and then create a new DB with 'mydb' DB user as the owner:

    bash> createdb -U postgres -O mydb mydb
    bash> psql -U mydb mydb

To delete the DB:
    
    bash> dropdb -U postgres mydb

Create a test table:

```
CREATE TABLE customers (id SERIAL, first_name text, last_name text);
INSERT INTO customers VALUES(1, 'Zemian', 'Deng');
INSERT INTO customers VALUES(2, 'John', 'Smith');
SELECT * FROM customers;
```

## Helpful CLI commands:

Display all databases
    
    \l

Display all tables
    
    \d

Describe a table definition

    \d tbl1
    
Connect to another database

    \c postgres


## How to startup server at system start up

To have launchd start postgresql now and restart at login:

    brew services start postgresql

## Sample database: chinook

This is an artist album database.

    wget https://github.com/yugabyte/yugabyte-db/raw/master/sample/chinook_ddl.sql
    wget https://github.com/yugabyte/yugabyte-db/raw/master/sample/ok_genres_artists_albums.sql
    wget https://github.com/yugabyte/yugabyte-db/raw/master/sample/chinook_songs.sql

    createdb chinook
    psql -d chinook -f chinook_ddl.sql
    psql -d chinook -f ok_genres_artists_albums.sql
    psql -d chinook -f chinook_songs.sql


## Sample database: dvdrental

https://www.postgresqltutorial.com/postgresql-sample-database/

Create `postgres` user if it doesn't already exists:
    
    createuser -s postgres

Create a new db:

    createdb dvdrental

Load the sample db:

    1. unzip dvdrental.zip
    2. pg_restore -d dvdrental dvdrental.tar


NOTE: Similar database from postgres site:

https://wiki.postgresql.org/wiki/Sample_Databases

The MySQL version is called Sakila, while PostgreSQL version is called Pagila. But they both are just fictional
DVD rental store DB for studying.



## Sample database: employees (Small from EDB)

https://www.enterprisedb.com/edb-docs/d/edb-postgres-advanced-server/user-guides/database-compatibility-for-oracle-developers-guide/9.4/Database_Compatibility_for_Oracle_Developers_Guide.1.010.html

## Sample database: employees (Large dataset and good for performance testing)

https://github.com/h8/employees-database


Repository contains two dump files:

    employees_data.sql.bz2 – schema with data (~140Mb uncompressed)
    employees_schema.sql – schema only

Data was converted to PostgreSQL format. Tables and some columns where renamed.

The database contains about 300,000 employee records with 2.8 million salary entries.


## Postgres RESTFul API

https://postgres.rest

Install and Setup:

    bash> brew install prest
    bash> PREST_DEBUG=true PREST_PG_USER=postgres PREST_PG_DATABASE=postgres PREST_PG_PORT=5432 PREST_HTTP_PORT=3000 prest

Example REST Queries:

    http://localhost:3000/databases
    http://localhost:3000/schemas
    http://localhost:3000/tables
    
    http://localhost:3000/postgres/information_schema
    http://localhost:3000/postgres/information_schema/tables
    http://localhost:3000/postgres/information_schema/tables?_count=*
    http://localhost:3000/postgres/information_schema/tables?_page=2&_page_size=20
    http://localhost:3000/postgres/information_schema/tables?table_schema=public
    http://localhost:3000/postgres/information_schema/tables?table_type=$like.%25VIEW

NOTE: You need to use '%25' to encode '%' for LIKE operator query.

To use a config file: "prest.toml" and allow CORS: (The file needs to be in directory where prest starts):

```
debug=true 

[pg]
host = "localhost"
port = 5432
database = "mydb"
user = "mydb"
pass = "test1"

[cors]
alloworigin = ["*"]
```