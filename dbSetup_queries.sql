CREATE TABLE books (
	id SERIAL primary key,
	title VARCHAR(100),
	description text,
	isbn_code text,
	rating integer,
	read_date date
);