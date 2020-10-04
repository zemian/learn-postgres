You need to install Python3 to run this example.

## Setup Python with Postgres Driver

```sh
python3 -m venv mypy
source mypy/bin/activate
python -V

pip list
pip install psycopg2-binary

cd learn-postgres/python-examples
python hello.py

# To exit
deactivate
```

See https://www.psycopg.org/docs/
