SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS public;
COMMENT ON SCHEMA public IS 'standard public schema';

DROP TABLE IF EXISTS public.horarios CASCADE;
DROP TABLE IF EXISTS public.profesor_materias CASCADE;
DROP TABLE IF EXISTS public.materias CASCADE;
DROP TABLE IF EXISTS public.carreras CASCADE;
DROP TABLE IF EXISTS public.profesores CASCADE;
DROP TABLE IF EXISTS public.tokens_auth CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.salones CASCADE;
DROP TABLE IF EXISTS public.ubicaciones CASCADE;

DROP SEQUENCE IF EXISTS public.carreras_carrera_id_seq;
DROP SEQUENCE IF EXISTS public.horarios_horario_id_seq;
DROP SEQUENCE IF EXISTS public.materias_materia_id_seq;
DROP SEQUENCE IF EXISTS public.roles_rol_id_seq;
DROP SEQUENCE IF EXISTS public.salones_salon_id_seq;
DROP SEQUENCE IF EXISTS public.tokens_auth_token_id_seq;
DROP SEQUENCE IF EXISTS public.ubicaciones_ubicacion_id_seq;
DROP SEQUENCE IF EXISTS public.usuarios_usuario_id_seq;



SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);
CREATE SEQUENCE public.roles_rol_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;

CREATE TABLE public.usuarios (
    usuario_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol_id integer NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.usuarios_usuario_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;

CREATE TABLE public.tokens_auth (
    token_id integer NOT NULL,
    usuario_id integer NOT NULL,
    token character varying(255) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.tokens_auth_token_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.tokens_auth_token_id_seq OWNED BY public.tokens_auth.token_id;

CREATE TABLE public.profesores (
    profesor_id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    matricula character varying(50) NOT NULL,
    grado_academico character varying(255),
    numero_plaza character varying(50),
    numero_contrato character varying(50),
    direccion text,
    telefono character varying(20)
);

CREATE TABLE public.carreras (
    carrera_id integer NOT NULL,
    nombre_carrera character varying(255) NOT NULL,
    total_semestres integer NOT NULL
);
CREATE SEQUENCE public.carreras_carrera_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.carreras_carrera_id_seq OWNED BY public.carreras.carrera_id;

CREATE TABLE public.materias (
    materia_id integer NOT NULL,
    nombre_materia character varying(255) NOT NULL,
    carrera_id integer NOT NULL,
    numero_semestre integer NOT NULL
);
CREATE SEQUENCE public.materias_materia_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.materias_materia_id_seq OWNED BY public.materias.materia_id;

CREATE TABLE public.profesor_materias (
    profesor_id integer NOT NULL,
    materia_id integer NOT NULL
);

CREATE TABLE public.ubicaciones (
    ubicacion_id integer NOT NULL,
    nombre_edificio character varying(100) NOT NULL
);
CREATE SEQUENCE public.ubicaciones_ubicacion_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.ubicaciones_ubicacion_id_seq OWNED BY public.ubicaciones.ubicacion_id;

CREATE TABLE public.salones (
    salon_id integer NOT NULL,
    nombre_salon character varying(100) NOT NULL,
    ubicacion_id integer NOT NULL
);
CREATE SEQUENCE public.salones_salon_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.salones_salon_id_seq OWNED BY public.salones.salon_id;

CREATE TABLE public.horarios (
    horario_id integer NOT NULL,
    profesor_id integer NOT NULL,
    materia_id integer NOT NULL,
    salon_id integer NOT NULL,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL
);
CREATE SEQUENCE public.horarios_horario_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.horarios_horario_id_seq OWNED BY public.horarios.horario_id;

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);
ALTER TABLE ONLY public.horarios ALTER COLUMN horario_id SET DEFAULT nextval('public.horarios_horario_id_seq'::regclass);
ALTER TABLE ONLY public.materias ALTER COLUMN materia_id SET DEFAULT nextval('public.materias_materia_id_seq'::regclass);
ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);
ALTER TABLE ONLY public.salones ALTER COLUMN salon_id SET DEFAULT nextval('public.salones_salon_id_seq'::regclass);
ALTER TABLE ONLY public.tokens_auth ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_auth_token_id_seq'::regclass);
ALTER TABLE ONLY public.ubicaciones ALTER COLUMN ubicacion_id SET DEFAULT nextval('public.ubicaciones_ubicacion_id_seq'::regclass);
ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);

INSERT INTO public.roles (rol_id, nombre_rol) VALUES (1, 'administrador');
INSERT INTO public.roles (rol_id, nombre_rol) VALUES (2, 'profesor');

SELECT pg_catalog.setval('public.carreras_carrera_id_seq', 1, false);
SELECT pg_catalog.setval('public.horarios_horario_id_seq', 1, false);
SELECT pg_catalog.setval('public.materias_materia_id_seq', 1, false);
SELECT pg_catalog.setval('public.roles_rol_id_seq', 2, true);
SELECT pg_catalog.setval('public.salones_salon_id_seq', 1, false);
SELECT pg_catalog.setval('public.tokens_auth_token_id_seq', 1, false);
SELECT pg_catalog.setval('public.ubicaciones_ubicacion_id_seq', 1, false);
SELECT pg_catalog.setval('public.usuarios_usuario_id_seq', 1, false);


ALTER TABLE ONLY public.carreras ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);
ALTER TABLE ONLY public.horarios ADD CONSTRAINT horarios_pkey PRIMARY KEY (horario_id);
ALTER TABLE ONLY public.materias ADD CONSTRAINT materias_pkey PRIMARY KEY (materia_id);
ALTER TABLE ONLY public.profesor_materias ADD CONSTRAINT profesor_materias_pkey PRIMARY KEY (profesor_id, materia_id);
ALTER TABLE ONLY public.profesores ADD CONSTRAINT profesores_pkey PRIMARY KEY (profesor_id);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);
ALTER TABLE ONLY public.salones ADD CONSTRAINT salones_pkey PRIMARY KEY (salon_id);
ALTER TABLE ONLY public.tokens_auth ADD CONSTRAINT tokens_auth_pkey PRIMARY KEY (token_id);
ALTER TABLE ONLY public.ubicaciones ADD CONSTRAINT ubicaciones_pkey PRIMARY KEY (ubicacion_id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);

ALTER TABLE ONLY public.carreras ADD CONSTRAINT carreras_nombre_carrera_key UNIQUE (nombre_carrera);
ALTER TABLE ONLY public.profesores ADD CONSTRAINT profesores_matricula_key UNIQUE (matricula);
ALTER TABLE ONLY public.profesores ADD CONSTRAINT profesores_numero_contrato_key UNIQUE (numero_contrato);
ALTER TABLE ONLY public.profesores ADD CONSTRAINT profesores_numero_plaza_key UNIQUE (numero_plaza);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);
ALTER TABLE ONLY public.tokens_auth ADD CONSTRAINT tokens_auth_token_key UNIQUE (token);
ALTER TABLE ONLY public.ubicaciones ADD CONSTRAINT ubicaciones_nombre_edificio_key UNIQUE (nombre_edificio);
ALTER TABLE ONLY public.horarios ADD CONSTRAINT uq_horario_profesor UNIQUE (profesor_id, dia_semana, hora_inicio);
ALTER TABLE ONLY public.horarios ADD CONSTRAINT uq_horario_salon UNIQUE (salon_id, dia_semana, hora_inicio);
ALTER TABLE ONLY public.salones ADD CONSTRAINT uq_salon_ubicacion UNIQUE (nombre_salon, ubicacion_id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_email_key UNIQUE (email);

ALTER TABLE ONLY public.materias ADD CONSTRAINT fk_carrera FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.horarios ADD CONSTRAINT fk_materia_horario FOREIGN KEY (materia_id) REFERENCES public.materias(materia_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profesor_materias ADD CONSTRAINT fk_materia_preferencia FOREIGN KEY (materia_id) REFERENCES public.materias(materia_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.horarios ADD CONSTRAINT fk_profesor_horario FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profesor_materias ADD CONSTRAINT fk_profesor_preferencia FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.horarios ADD CONSTRAINT fk_salon_horario FOREIGN KEY (salon_id) REFERENCES public.salones(salon_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.salones ADD CONSTRAINT fk_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES public.ubicaciones(ubicacion_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.profesores ADD CONSTRAINT fk_usuario_profesor FOREIGN KEY (profesor_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tokens_auth ADD CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;
