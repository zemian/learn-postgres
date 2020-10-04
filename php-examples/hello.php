<?php

// A simple DB connection test
echo "Connection Test: ";
$conn = pg_connect("host=localhost dbname=testdb user=zemian password=test123")
    or die('Could not connect: ' . pg_last_error());
echo "Successful!\n";

echo "Query Test:\n";
$result = pg_query('SELECT 1 + 1') or die('Query failed: ' . pg_last_error());
$rows = pg_fetch_array($result, null, PGSQL_ASSOC);
var_dump($rows);

pg_free_result($result);
pg_close($conn);
