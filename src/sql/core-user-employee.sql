CREATE TABLE public.core_user
(
    id bigserial PRIMARY KEY,
    password text COLLATE pg_catalog."default",
    email text NOT NULL,
    user_name text NOT NULL,
    CONSTRAINT core_user_email_key UNIQUE (email)
)

CREATE TABLE public.core_employee
(
 id bigserial PRIMARY KEY,
 family_name text NOT NULL,
 given_name text NOT NULL,
 user_id integer REFERENCES core_user(id),
 CONSTRAINT core_employee_user_id_key UNIQUE (user_id)
);