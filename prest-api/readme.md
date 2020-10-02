
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
