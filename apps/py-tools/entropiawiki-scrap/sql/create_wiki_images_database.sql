\set py_image_db_name 'wiki_images'
\set py_image_db_user 'py_image_user'
\set py_image_db_password 'change_me'

DO
$$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = :'py_image_db_user') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'py_image_db_user', :'py_image_db_password');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'py_image_db_user', :'py_image_db_password');
  END IF;
END
$$;

SELECT format('CREATE DATABASE %I OWNER %I', :'py_image_db_name', :'py_image_db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'py_image_db_name')
\gexec

GRANT ALL PRIVILEGES ON DATABASE :"py_image_db_name" TO :"py_image_db_user";
