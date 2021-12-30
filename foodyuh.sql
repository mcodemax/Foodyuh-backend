\echo 'Delete and recreate foodyuh db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE foodyuh;
CREATE DATABASE foodyuh;
\connect foodyuh

\i foodyuh-schema.sql
\i foodyuh-seed.sql

\echo 'Delete and recreate foodyuh_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE foodyuh_test;
CREATE DATABASE foodyuh_test;
\connect foodyuh_test

\i foodyuh-schema.sql
