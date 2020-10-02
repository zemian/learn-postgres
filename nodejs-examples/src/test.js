// Example to test simple CRUD operations
const { Client } = require('pg');

async function selectAll(conn, callback) {
	return conn
		.query('SELECT * FROM test')
		.then(res => callback(res.rows));
}

async function selectById(conn, id, callback) {
	return conn
		.query('SELECT * FROM test WHERE id = $1', [id])
		.then(res => callback(res.rows[0]));
}

async function selectByCat(conn, cat, callback) {
	return conn
		.query('SELECT * FROM test WHERE cat = $1', [cat])
		.then(res => callback(res.rows));
}

async function selectTotal(conn, cat, callback) {
	return conn
		.query('SELECT sum(price) AS total FROM test WHERE cat = $1', [cat])
		.then(res => callback(res.rows[0].total));
}

async function insert(conn, cat, price, qty, callback) {
	return conn
		.query('INSERT INTO test(cat, price, qty) VALUES ($1, $2, $3)', [cat, price, qty])
		.then(res => callback(res.rowCount));
}

async function update(conn, id, price, qty, callback) {
	return conn
		.query('UPDATE test SET price = $1, qty = $2 WHERE id = $3', [price, qty, id])
		.then(res => callback(res.rowCount));
}

async function deleteById(conn, id, callback) {
	return conn
		.query('DELETE FROM test WHERE id = $1', [id])
		.then(res => callback(res.rowCount));
}

async function deleteByCat(conn, cat, callback) {
	return conn
		.query('DELETE FROM test WHERE cat = $1', [cat])
		.then(res => callback(res.rowCount));
}

// Main script test
(async () => {
	conn = new Client({
		host: 'localhost',
		database: 'testdb',
		user: 'zemian',
		password: 'test123',
		port: 5432,
	});
	try {
		await conn.connect();
		await selectAll(conn, (ret) => console.log(ret));
		// await selectById(conn, 1, (ret) => console.log(ret));
		// await selectByCat(conn, 'test', (ret) => console.log(ret));

		// await insert(conn, 'js', 0.10, 1, (ret) => console.log(ret));
		// await insert(conn, 'js', 0.20, 2, (ret) => console.log(ret));
		// await selectByCat(conn, 'js', (ret) => console.log(ret));
		
		// await selectTotal(conn, 'js', (ret) => console.log(ret));
		// await update(conn, 13, 0.99, 10, (ret) => console.log(ret));
		// await selectTotal(conn, 'js', (ret) => console.log(ret));
		
		// await deleteById(conn, 13, (ret) => console.log(ret));
		// await selectById(conn, 13, (ret) => console.log(ret));

		// await deleteByCat(conn, 'js', (ret) => console.log(ret));
		// await selectByCat(conn, 'js', (ret) => console.log(ret));
	} finally {
		await conn.end();
	}
})();
