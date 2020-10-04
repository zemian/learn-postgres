import psycopg2
import string
import random
import math

def insert(conn, cat, price, qty):
	ret = None
	cursor = conn.cursor()
	cursor.execute('INSERT INTO test(cat, price, qty) VALUES (%s, %s, %s) RETURNING id', (cat, price, qty))
	if (cursor.rowcount):
		ret = cursor.fetchone()[0]
	cursor.close()
	conn.commit()
	return ret

def select_all(conn):
	cursor = conn.cursor()
	cursor.execute('SELECT id, cat, price, qty FROM test')
	ret = cursor.fetchall()
	cursor.close()
	return ret

def select_by_id(conn, id):
	cursor = conn.cursor()
	cursor.execute('SELECT id, cat, price, qty FROM test WHERE id = %s', (id,))
	ret = cursor.fetchone()
	cursor.close()
	return ret

# return list of row. The row is array of data, not a dict!
def select_by_cat(conn, cat):
	cursor = conn.cursor()
	cursor.execute('SELECT id, cat, price, qty FROM test WHERE cat = %s', (cat,))
	ret = cursor.fetchall()
	cursor.close()
	return ret

def select_total(conn, cat):
	cursor = conn.cursor()
	cursor.execute('SELECT sum(price) FROM test WHERE cat = %s', (cat,))
	ret = cursor.fetchone()[0]
	cursor.close()
	return ret

def update(conn, id, price, qty):
	cursor = conn.cursor()
	cursor.execute('UPDATE test SET price = %s, qty = %s WHERE id = %s', (price, qty, id))
	ret = cursor.rowcount
	cursor.close()
	conn.commit()
	return ret

def delete_by_id(conn, id):
	cursor = conn.cursor()
	cursor.execute('DELETE FROM test WHERE id = %s', (id,))
	ret = cursor.rowcount
	cursor.close()
	conn.commit()
	return ret

def delete_by_cat(conn, cat):
	cursor = conn.cursor()
	cursor.execute('DELETE FROM test WHERE cat = %s', (cat,))
	ret = cursor.rowcount
	cursor.close()
	conn.commit()
	return ret


def testeq(actual, expected, extramsg = ''):
	if actual != expected:
		raise Exception(f"Failed on expected {expected}, but got {actual}. {extramsg}")

conn = psycopg2.connect(dbname="testdb", user="zemian", password="test123", host="localhost", port=5432)
try:
	letters = [random.choice(string.ascii_letters + string.digits) for n in range(10)]
	test_cat = "".join(letters)
	test_count = 25
	test_ids = []

	print(f"Test insert with {test_count} rows and cat={test_cat}")
	for i in range(1, test_count + 1):
		id = insert(conn, test_cat, 0.10 + i, i)
		testeq(id > 0, True, f"{id} > 0")
		test_ids.append(id)

	print("Test select_by_cat");
	rows = select_by_cat(conn, test_cat);
	testeq(len(rows), test_count);
	testeq(rows[0][1], test_cat);
	testeq(rows[0][2] > 0.10, True, f"rows[0][2]={rows[0][2]} > 0.10");
	testeq(rows[0][3], 1);
	testeq(rows[1][1], test_cat);
	testeq(rows[1][2] > 0.10, True, f"rows[1][2]={rows[1][2]} > 0.10");
	testeq(rows[1][3], 2);


	print("Test select_all");
	rows = select_all(conn);
	testeq(len(rows) >= test_count, True, f"len(rows)={len(rows)} >= {test_count}");

	print("Test select_by_id")
	row = select_by_id(conn, test_ids[0])
	testeq(row[0], test_ids[0])
	testeq(row[1], test_cat)
	testeq(math.isclose(row[2], 1.10), True, f"row[2]={row[2]} isclose 1.10")
	testeq(row[3], 1)

	print("Test select_total")
	total = select_total(conn, test_cat)
	testeq(math.isclose(total, 327.5000), True, f"{total} isclose 327.5000")

	print("Test update")
	count = update(conn, test_ids[0], 0.99, 998877)
	testeq(count, 1)
	row = select_by_id(conn, test_ids[0])
	testeq(row[0], test_ids[0])
	testeq(row[1], test_cat)
	testeq(math.isclose(row[2], 0.99), True, f"row[2]={row[2]} isclose 0.99")
	testeq(row[3], 998877)

	print("Test delete_by_id")
	count = delete_by_id(conn, test_ids[0])
	testeq(count, 1)
	row = select_by_id(conn, test_ids[0])
	testeq(row, None)
	
	print("Test delete_by_cat")
	count = delete_by_cat(conn, test_cat)
	testeq(count, test_count - 1)

	rows = select_by_cat(conn, test_cat)
	testeq(len(rows), 0)
finally:
	conn.close()
