import psycopg2

# Connect to your postgres DB
conn = psycopg2.connect("dbname=testdb user=zemian")

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a query
cur.execute("SELECT 1 + 1");

# Retrieve query results
records = cur.fetchall()

print(records)

cur.close()
conn.close()
