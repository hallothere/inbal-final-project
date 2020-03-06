DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset_codes;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      url VARCHAR,
      bio VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    code VARCHAR NOT NULL CHECK (code != ''),
    email VARCHAR NOT NULL CHECK (email != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
