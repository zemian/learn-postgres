
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
