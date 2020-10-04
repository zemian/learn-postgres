<?php

// Example to test simple CRUD operations

function insert($conn, $cat, $price, $qty) {
	$sql = 'INSERT INTO test(cat, price, qty) VALUES ($1, $2, $3) RETURNING id';
	$result = pg_query_params($conn, $sql, [$cat, $price, $qty]);
	$row = pg_fetch_assoc($result, null);
	$ret = intval($row['id']);
	pg_query('COMMIT');
	pg_free_result($result);
	return $ret;
}

function fixtype($row) {
	$row['id'] = intval($row['id']);
	$row['qty'] = intval($row['qty']);
	$row['price'] = floatval($row['price']);
	return $row;
}

function select_by_cat($conn, $cat) {
	$ret = [];
	$sql = 'SELECT * FROM test WHERE cat = $1 ORDER BY id';
	$result = pg_query_params($conn, $sql, [$cat]);
	while ($row = pg_fetch_assoc($result, null)) {
		$row = fixtype($row);
		array_push($ret, $row);
	}
	pg_free_result($result);
	return $ret;
}

// Use this to test whether record exists
function select_by_id($conn, $id) {
	$ret = [];
	$sql = 'SELECT * FROM test WHERE id = $1';
	$result = pg_query_params($conn, $sql, [$id]);
	while ($row = pg_fetch_assoc($result, null)) {
		$row = fixtype($row);
		array_push($ret, $row);
	}
	pg_free_result($result);
	return $ret;
}

// Throws exception if record does not exists.
function get_by_id($conn, $id) {
	$sql = 'SELECT * FROM test WHERE id = $1';
	$result = pg_query_params($conn, $sql, [$id]);
	$row = pg_fetch_assoc($result, null);
	pg_free_result($result);

	if (!$row)
		throw new Exception("Id $id not found.");

	$row = fixtype($row);
	return $row;
}

function get_total_by_cat($conn, $cat) {
	$sql = 'SELECT sum(price) AS total FROM test WHERE cat = $1';
	$result = pg_query_params($conn, $sql, [$cat]);
	$row = pg_fetch_assoc($result, null);
	pg_free_result($result);
	$ret = $row['total'];
	return $ret;
}

function update($conn, $id, $price, $qty) {
	$sql = 'UPDATE test SET price = $1, qty = $2 WHERE id = $3';
	$result = pg_query_params($conn, $sql, [$price, $qty, $id]);
	$ret = pg_affected_rows($result);
	pg_query('COMMIT');
	pg_free_result($result);
	return $ret;
}

function delete_by_id($conn, $id) {
	$sql = 'DELETE FROM test WHERE id = $1';
	$result = pg_query_params($conn, $sql, [$id]);
	$ret = pg_affected_rows($result);
	pg_query('COMMIT');
	pg_free_result($result);
	return $ret;
}

function delete_by_cat($conn, $cat) {
	$sql = 'DELETE FROM test WHERE cat = $1';
	$result = pg_query_params($conn, $sql, [$cat]);
	$ret = pg_affected_rows($result);
	pg_query('COMMIT');
	pg_free_result($result);
	return $ret;
}

// Test functions
function asserteq($actual, $expected, $reason = '') {
	if ($actual !== $expected) {
		throw new Exception("Failed on {$actual}, expected {$expected}. {$reason}");
	}
}
function isclose($a, $b) {
	if (abs($a - $b) < 0.00001) {
		return true;
	}
	return false;
}
function create_conn() {
	$conn = pg_connect("host=localhost dbname=testdb user=zemian password=test123")
    or die('Could not connect: ' . pg_last_error());
    return $conn;
}

$conn = create_conn();
try {
	$test_cat = substr(uniqid(), 0, 10);
	$test_count = 25;
	$test_ids = [];
	asserteq($test_cat !== '', true, "$test_cat");

	echo("Test insert with {$test_count} rows and cat={$test_cat}\n");
	for ($i = 1; $i <= $test_count; $i++) {
		$id = insert($conn, $test_cat, 0.10 + $i, $i);
		asserteq($id > 0, true, "{$id} > 0");
		array_push($test_ids, $id);
	}

	echo("Test select_by_cat\n");
	$rows = select_by_cat($conn, $test_cat);
	asserteq(count($rows), $test_count);
	asserteq($rows[0]['cat'], $test_cat);
	asserteq($rows[0]['price'] > 0.10, true, "{$rows[0]['price']}");
	asserteq($rows[0]['qty'], 1);
	asserteq($rows[1]['cat'], $test_cat);
	asserteq($rows[1]['price'] > 0.10, true, "{$rows[1]['price']}");
	asserteq($rows[1]['qty'], 2);

	echo("Test get_by_id\n");
	$row = get_by_id($conn, $test_ids[0]);
	asserteq($row['id'], $test_ids[0]);
	asserteq($row['cat'], $test_cat);
	asserteq(isclose($row['price'], 1.10), true, "{$row['price']}");
	asserteq($row['qty'], 1);

	echo("Test get_total_by_cat\n");
	$total = get_total_by_cat($conn, $test_cat);
	asserteq(isclose($total, 327.5000), true, "$total");

	echo("Test conn reconnect\n");
	pg_close($conn);
	$conn = create_conn();

	echo("Test update\n");
	$count = update($conn, $test_ids[0], 0.99, 998877);
	asserteq($count, 1);
	$row = get_by_id($conn, $test_ids[0]);
	asserteq($row['id'], $test_ids[0]);
	asserteq($row['cat'], $test_cat);
	asserteq(isclose($row['price'], 0.99), true, "{$row['price']}");
	asserteq($row['qty'], 998877);

	echo("Test delete_by_id\n");
	$count = delete_by_id($conn, $test_ids[0]);
	asserteq($count, 1);
	$rows = select_by_id($conn, $test_ids[0]);
	asserteq(count($rows), 0);

	echo("Test delete_by_cat\n");
	$count = delete_by_cat($conn, $test_cat);
	asserteq($count, $test_count - 1);
	$rows = select_by_cat($conn, $test_cat);
	asserteq(count($rows), 0);
} finally {
	pg_close($conn);
}
