const { Client } = require('pg');
//const client = new Client();
const client = new Client({
  host: 'localhost',
  database: 'testdb',
  user: 'zemian',
  password: 'test123',
  port: 5432,
});

(async () => {
  await client.connect();
  const res = await client.query('SELECT $1::text as message', ['Hello world!']);
  console.log(res.rows[0].message); // Hello world!
  await client.end();
})();
