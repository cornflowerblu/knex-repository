CREATE TABLE public.users (
	id SERIAL,
	user_name text NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (user_name)
);

CREATE TABLE public.accounts (
	id SERIAL,
	account_name text NOT NULL,
	user_id INTEGER NOT NULL,
	CONSTRAINT accounts_pk PRIMARY KEY (id),
	CONSTRAINT accounts_un UNIQUE (account_name),
	CONSTRAINT accounts_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

