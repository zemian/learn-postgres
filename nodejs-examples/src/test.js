// Example to test simple CRUD operations
// https://node-postgres.com
const { Client } = require('pg')
const client = new Client();

function selectAll(conn, callback) {
	conn.query('SELECT * FROM test', function (error, results) {
	  if (error) throw error;
	  callback(results);
	});	
}

function selectById(conn, id, callback) {
	conn.query('SELECT * FROM test WHERE id = ?', [id], function (error, results) {
	  if (error) throw error;
	  callback(results[0]);
	});	
}

function selectByCat(conn, cat, callback) {
	conn.query('SELECT * FROM test WHERE cat = ?', [cat], function (error, results) {
	  if (error) throw error;
	  callback(results);
	});
}

function selectTotal(conn, cat, callback) {
	conn.query('SELECT sum(price) AS total FROM test WHERE cat = ?', [cat], function (error, results) {
	  if (error) throw error;
	  ret = results[0].total;
	  callback(ret)
	});
}

function insert(conn, cat, price, qty, callback) {
	conn.query('INSERT INTO test(cat, price, qty) VALUES (?, ?, ?)', [cat, price, qty], function (error, results) {
	  if (error) throw error;
	  callback(results)
	});
}

function update(conn, id, price, qty, callback) {
	conn.query('UPDATE test SET price = ?, qty = ? WHERE id = ?', [price, qty, id], function (error, results) {
	  if (error) throw error;
	  callback(results)
	});
}

function deleteById(conn, id, callback) {
	conn.query('DELETE FROM test WHERE id = ?', [id], function (error, results) {
	  if (error) throw error;
	  callback(results)
	});
}

function deleteByCat(conn, cat, callback) {
	conn.query('DELETE FROM test WHERE cat = ?', [cat], function (error, results) {
	  if (error) throw error;
	  callback(results)
	});
}


try {
	selectAll(conn, (ret) => console.log(ret));
	// selectById(conn, 1, (ret) => console.log(ret));
	// selectByCat(conn, 'test', (ret) => console.log(ret));

	// insert(conn, 'js', 0.10, 1, (ret) => console.log(ret));
	// insert(conn, 'js', 0.20, 2, (ret) => console.log(ret));
	// selectByCat(conn, 'js', (ret) => console.log(ret));
	
	// selectTotal(conn, 'js', (ret) => console.log(ret));
	// update(conn, 39, 0.99, 10, (ret) => console.log(ret));
	// selectTotal(conn, 'js', (ret) => console.log(ret));
	
	// //selectById(conn, 39, (ret) => console.log(ret));
	// deleteById(conn, 39, (ret) => console.log(ret));
	// selectById(conn, 39, (ret) => console.log(ret));

	// //selectByCat(conn, 'js', (ret) => console.log(ret));
	// deleteByCat(conn, 'js', (ret) => console.log(ret));
	// selectByCat(conn, 'js', (ret) => console.log(ret));

} finally {
	conn.end();	
}
