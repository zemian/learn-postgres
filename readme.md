## PostgreSQL

https://www.postgresql.org/

## Quick Start

```sh
createuser -s -P zemian # Enter password 'test123' when prompted
createdb -O zemian testdb
cat examples/test.sql|psql -U zemian testdb
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

A typical default setup for PostgreSQL is to create a System user that has same name as the DB user. Since a default database name 'postgres' and DB user 'postgres' is often automatically created, we often create a special System user account named 'postgres' to start the DB server process as well.

However, a normal system user may setup similar way that match to a DB user, and create a DB with same name. 
If we do this then the 'psql' client can be started without any extra arguments. Because the 'psql' has the following default:

    bash> psql -U <system_user_name> <system_user_name>

So for a system user 'zemian' who logged in to a terminal, the following will connect to `zemian` DB:
    
    bash> psql
    
    # Now verify current connected user
    zemian=# select current_user;
    
## Create A New DB Users

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

Connect to DB with 'postgres' as superuser, and then create a new DB with `mydb` DB user as the owner:

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

## Test Query

    SELECT 1
    
https://stackoverflow.com/questions/3668506/efficient-sql-test-query-or-validation-query-that-will-work-across-all-or-most