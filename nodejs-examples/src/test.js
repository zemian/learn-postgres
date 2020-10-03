// Example to test simple CRUD operations
const { Client } = require('pg');
const assert = require('assert');

// Return the ID it was inserted
function insert(conn, cat, price, qty) {
	return conn
		.query('INSERT INTO test(cat, price, qty) VALUES ($1, $2, $3) RETURNING id', [cat, price, qty])
		.then(res => res.rows[0].id);
}

function selectByCat(conn, cat) {
	return conn
		.query('SELECT * FROM test WHERE cat = $1 ORDER BY id', [cat])
		.then(res => res.rows);
}

// Return the nubmer of rows deleted.
function deleteByCat(conn, cat) {
	return conn
		.query('DELETE FROM test WHERE cat = $1', [cat])
		.then(res => res.rowCount);
}

function selectAll(conn) {
	return conn
		.query('SELECT * FROM test')
		.then(res => res.rows);
}

function selectById(conn, id) {
	return conn
		.query('SELECT * FROM test WHERE id = $1', [id])
		.then(res => res.rows[0]);
}

function selectTotal(conn, cat) {
	return conn
		.query('SELECT sum(price) AS total FROM test WHERE cat = $1', [cat])
		.then(res => res.rows[0].total);
}

function update(conn, id, price, qty) {
	return conn
		.query('UPDATE test SET price = $1, qty = $2 WHERE id = $3', [price, qty, id])
		.then(res => res.rowCount);
}

function deleteById(conn, id) {
	return conn
		.query('DELETE FROM test WHERE id = $1', [id])
		.then(res => res.rowCount);
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
		let testCat = Math.random().toString(16).substring(2, 12);
		let testCount = 25;
		let testIds = [];

		await conn.connect();

		console.log("Test insert " + testCount + " rows with cat=" + testCat);		
		for (let i = 1; i <= testCount; i++) {
			await insert(conn, testCat, 0.10 + i, i).then((id) => {
				assert(id > 0);
				testIds.push(id);
			});
		}
		await selectByCat(conn, testCat).then((rows) => {
			console.log("Test selectByCat after insert. Count=" + rows.length);
			assert(rows.length === testCount);
			assert(rows[0].qty === 1);
			assert(rows[1].qty === 2);
			assert(rows[0].price > 0.10);
			assert(rows[1].price > 0.10);
		});

		await selectAll(conn).then((rows) => {
			console.log("Test selectAll. Count=" + rows.length);
			assert(rows.length >= testCount);
			assert(rows.every(e => e.id > 0));
			assert(rows.filter(e => e.cat === testCat).length == testCount);
		});

		await selectById(conn, testIds[0]).then((row) => {
			console.log("test selectById:", testIds[0]);
			assert(row.id === testIds[0]);
			assert(row.cat === testCat);
			assert(row.price <= 1.10);
			assert(row.qty === 1);
		});

		await selectTotal(conn, testCat).then((total) => {
			assert(total <= 327.5000);
		});
		await update(conn, testIds[0], 0.99, 998877).then(async (count) => {
			assert(count === 1);

			await selectById(conn, testIds[0]).then((row) => {
				assert(row.id === testIds[0]);
				assert(row.cat === testCat);
				assert(row.price <= 0.99);
				assert(row.qty === 998877);
			});
		});
		
		await deleteById(conn, testIds[0]).then(async (count) => {
			assert(count === 1);

			await selectById(conn, testIds[0]).then((row) => {
				assert(row === undefined);
			});
		});
		
		await deleteByCat(conn, testCat).then((count) => {
			console.log("Test deleteByCat. Count=", count);
			assert(count === testCount - 1);
		});
		await selectByCat(conn, testCat).then((rows) => {
			console.log("Test selectByCat after deleteByCat. Count=", rows.length);
			assert(rows.length === 0);
		});
	} finally {
		await conn.end();
	}
})();
