<?php

// A simple DB connection test
try {
	echo "Connection Test: ";
	$conn = new PDO('pgsql:host=localhost;dbname=testdb', 'zemian', 'test');
	echo "Successful!\n";

	echo "Query Test:\n";
	$rows = $conn->query('SELECT 1 + 1');
    var_dump($rows);

	$conn = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "\n";
}