--
-- PostgreSQL database dump
--

\restrict qtObnqtMxLisDOMNBlaRIwqjrPbVy7nXkppxK70eSH4uRkzztBDt8LQEyZ7Lfi2

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

-- Started on 2025-10-16 04:06:21 CST

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

DROP DATABASE IF EXISTS "GestHor";
--
-- TOC entry 3533 (class 1262 OID 32768)
-- Name: GestHor; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "GestHor" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE "GestHor" OWNER TO postgres;

\unrestrict qtObnqtMxLisDOMNBlaRIwqjrPbVy7nXkppxK70eSH4uRkzztBDt8LQEyZ7Lfi2
\connect "GestHor"
\restrict qtObnqtMxLisDOMNBlaRIwqjrPbVy7nXkppxK70eSH4uRkzztBDt8LQEyZ7Lfi2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 57354)
-- Name: carrera_materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrera_materias (
    carrera_id integer NOT NULL,
    materia_id integer NOT NULL,
    numero_semestre integer NOT NULL,
    CONSTRAINT check_semestre_positivo CHECK ((numero_semestre > 0))
);


ALTER TABLE public.carrera_materias OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 33511)
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    carrera_id integer NOT NULL,
    nombre_carrera character varying(255) NOT NULL,
    total_semestres integer NOT NULL
);


ALTER TABLE public.carreras OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33514)
-- Name: carreras_carrera_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carreras_carrera_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carreras_carrera_id_seq OWNER TO postgres;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 223
-- Name: carreras_carrera_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carreras_carrera_id_seq OWNED BY public.carreras.carrera_id;


--
-- TOC entry 229 (class 1259 OID 33530)
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    horario_id integer NOT NULL,
    profesor_id integer NOT NULL,
    materia_id integer NOT NULL,
    salon_id integer NOT NULL,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 33533)
-- Name: horarios_horario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_horario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_horario_id_seq OWNER TO postgres;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 230
-- Name: horarios_horario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_horario_id_seq OWNED BY public.horarios.horario_id;


--
-- TOC entry 233 (class 1259 OID 57345)
-- Name: materias_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materias_catalogo (
    materia_id integer NOT NULL,
    nombre_materia character varying(255) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.materias_catalogo OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 57344)
-- Name: materias_catalogo_materia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materias_catalogo_materia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materias_catalogo_materia_id_seq OWNER TO postgres;

--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 232
-- Name: materias_catalogo_materia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_catalogo_materia_id_seq OWNED BY public.materias_catalogo.materia_id;


--
-- TOC entry 224 (class 1259 OID 33519)
-- Name: profesor_materias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesor_materias (
    profesor_id integer NOT NULL,
    materia_id integer NOT NULL
);


ALTER TABLE public.profesor_materias OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33506)
-- Name: profesores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesores (
    profesor_id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    matricula character varying(50) NOT NULL,
    grado_academico character varying(255),
    numero_plaza character varying(50),
    numero_contrato character varying(50),
    direccion text,
    telefono character varying(20),
    email character varying
);


ALTER TABLE public.profesores OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49152)
-- Name: profesores_profesor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesores_profesor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesores_profesor_id_seq OWNER TO postgres;

--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 231
-- Name: profesores_profesor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesores_profesor_id_seq OWNED BY public.profesores.profesor_id;


--
-- TOC entry 215 (class 1259 OID 33490)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 33493)
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_rol_id_seq OWNER TO postgres;

--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- TOC entry 227 (class 1259 OID 33526)
-- Name: salones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salones (
    salon_id integer NOT NULL,
    nombre_salon character varying(100) NOT NULL,
    ubicacion_id integer NOT NULL
);


ALTER TABLE public.salones OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 33529)
-- Name: salones_salon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salones_salon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salones_salon_id_seq OWNER TO postgres;

--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 228
-- Name: salones_salon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salones_salon_id_seq OWNED BY public.salones.salon_id;


--
-- TOC entry 219 (class 1259 OID 33501)
-- Name: tokens_auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens_auth (
    token_id integer NOT NULL,
    usuario_id integer NOT NULL,
    token character varying(255) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tokens_auth OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 33505)
-- Name: tokens_auth_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_auth_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_auth_token_id_seq OWNER TO postgres;

--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 220
-- Name: tokens_auth_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_auth_token_id_seq OWNED BY public.tokens_auth.token_id;


--
-- TOC entry 225 (class 1259 OID 33522)
-- Name: ubicaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ubicaciones (
    ubicacion_id integer NOT NULL,
    nombre_edificio character varying(100) NOT NULL
);


ALTER TABLE public.ubicaciones OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 33525)
-- Name: ubicaciones_ubicacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ubicaciones_ubicacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ubicaciones_ubicacion_id_seq OWNER TO postgres;

--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 226
-- Name: ubicaciones_ubicacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ubicaciones_ubicacion_id_seq OWNED BY public.ubicaciones.ubicacion_id;


--
-- TOC entry 217 (class 1259 OID 33494)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol_id integer NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 33500)
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;


--
-- TOC entry 3301 (class 2604 OID 33534)
-- Name: carreras carrera_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 33535)
-- Name: horarios horario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN horario_id SET DEFAULT nextval('public.horarios_horario_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 57348)
-- Name: materias_catalogo materia_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo ALTER COLUMN materia_id SET DEFAULT nextval('public.materias_catalogo_materia_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 49161)
-- Name: profesores profesor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores ALTER COLUMN profesor_id SET DEFAULT nextval('public.profesores_profesor_id_seq'::regclass);


--
-- TOC entry 3295 (class 2604 OID 33537)
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- TOC entry 3303 (class 2604 OID 33538)
-- Name: salones salon_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones ALTER COLUMN salon_id SET DEFAULT nextval('public.salones_salon_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 33539)
-- Name: tokens_auth token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_auth_token_id_seq'::regclass);


--
-- TOC entry 3302 (class 2604 OID 33540)
-- Name: ubicaciones ubicacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones ALTER COLUMN ubicacion_id SET DEFAULT nextval('public.ubicaciones_ubicacion_id_seq'::regclass);


--
-- TOC entry 3296 (class 2604 OID 33541)
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);


--
-- TOC entry 3527 (class 0 OID 57354)
-- Dependencies: 234
-- Data for Name: carrera_materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrera_materias (carrera_id, materia_id, numero_semestre) FROM stdin;
5	5	1
5	5	2
5	5	3
5	5	4
5	5	5
5	5	6
\.


--
-- TOC entry 3515 (class 0 OID 33511)
-- Dependencies: 222
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carreras (carrera_id, nombre_carrera, total_semestres) FROM stdin;
5	Ingenieria en sistemas	6
\.


--
-- TOC entry 3522 (class 0 OID 33530)
-- Dependencies: 229
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (horario_id, profesor_id, materia_id, salon_id, dia_semana, hora_inicio, hora_fin) FROM stdin;
\.


--
-- TOC entry 3526 (class 0 OID 57345)
-- Dependencies: 233
-- Data for Name: materias_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias_catalogo (materia_id, nombre_materia, fecha_creacion) FROM stdin;
5	Matematicas	2025-10-13 05:49:25.472811-06
\.


--
-- TOC entry 3517 (class 0 OID 33519)
-- Dependencies: 224
-- Data for Name: profesor_materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesor_materias (profesor_id, materia_id) FROM stdin;
\.


--
-- TOC entry 3514 (class 0 OID 33506)
-- Dependencies: 221
-- Data for Name: profesores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesores (profesor_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email) FROM stdin;
12	Jose	Clemente Corzo	100020762	Lic en software	ewrffewfew12	321321321312	Calle San Bernardino 261	9612215796	rubenclemente221@gmail.com
\.


--
-- TOC entry 3508 (class 0 OID 33490)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (rol_id, nombre_rol) FROM stdin;
1	administrador
2	profesor
\.


--
-- TOC entry 3520 (class 0 OID 33526)
-- Dependencies: 227
-- Data for Name: salones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salones (salon_id, nombre_salon, ubicacion_id) FROM stdin;
\.


--
-- TOC entry 3512 (class 0 OID 33501)
-- Dependencies: 219
-- Data for Name: tokens_auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens_auth (token_id, usuario_id, token, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3518 (class 0 OID 33522)
-- Dependencies: 225
-- Data for Name: ubicaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ubicaciones (ubicacion_id, nombre_edificio) FROM stdin;
\.


--
-- TOC entry 3510 (class 0 OID 33494)
-- Dependencies: 217
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (usuario_id, email, password, rol_id, fecha_creacion) FROM stdin;
2	admin@unach.mx	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	1	2025-10-12 00:52:53.83231-06
3	profe@unach.mx	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 00:53:37.286524-06
10	hidyt@mailinator.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 02:21:57.446188-06
11	fycibekix@mailinator.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 02:27:54.578438-06
12	rubenclemente221@gmail.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-13 05:06:39.903588-06
\.


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 223
-- Name: carreras_carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carreras_carrera_id_seq', 5, true);


--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 230
-- Name: horarios_horario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_horario_id_seq', 1, false);


--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 232
-- Name: materias_catalogo_materia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_catalogo_materia_id_seq', 5, true);


--
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 231
-- Name: profesores_profesor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesores_profesor_id_seq', 7, true);


--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_rol_id_seq', 2, true);


--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 228
-- Name: salones_salon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salones_salon_id_seq', 1, false);


--
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 220
-- Name: tokens_auth_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_auth_token_id_seq', 1, false);


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 226
-- Name: ubicaciones_ubicacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ubicaciones_ubicacion_id_seq', 1, false);


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_usuario_id_seq', 12, true);


--
-- TOC entry 3353 (class 2606 OID 57359)
-- Name: carrera_materias carrera_materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_pkey PRIMARY KEY (carrera_id, materia_id, numero_semestre);


--
-- TOC entry 3329 (class 2606 OID 33563)
-- Name: carreras carreras_nombre_carrera_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_nombre_carrera_key UNIQUE (nombre_carrera);


--
-- TOC entry 3331 (class 2606 OID 33543)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);


--
-- TOC entry 3343 (class 2606 OID 33545)
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (horario_id);


--
-- TOC entry 3349 (class 2606 OID 57353)
-- Name: materias_catalogo materias_catalogo_nombre_materia_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo
    ADD CONSTRAINT materias_catalogo_nombre_materia_key UNIQUE (nombre_materia);


--
-- TOC entry 3351 (class 2606 OID 57351)
-- Name: materias_catalogo materias_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo
    ADD CONSTRAINT materias_catalogo_pkey PRIMARY KEY (materia_id);


--
-- TOC entry 3333 (class 2606 OID 33549)
-- Name: profesor_materias profesor_materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT profesor_materias_pkey PRIMARY KEY (profesor_id, materia_id);


--
-- TOC entry 3321 (class 2606 OID 33565)
-- Name: profesores profesores_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_matricula_key UNIQUE (matricula);


--
-- TOC entry 3323 (class 2606 OID 33567)
-- Name: profesores profesores_numero_contrato_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_numero_contrato_key UNIQUE (numero_contrato);


--
-- TOC entry 3325 (class 2606 OID 33569)
-- Name: profesores profesores_numero_plaza_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_numero_plaza_key UNIQUE (numero_plaza);


--
-- TOC entry 3327 (class 2606 OID 33551)
-- Name: profesores profesores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_pkey PRIMARY KEY (profesor_id);


--
-- TOC entry 3309 (class 2606 OID 33571)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 3311 (class 2606 OID 33553)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- TOC entry 3339 (class 2606 OID 33555)
-- Name: salones salones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT salones_pkey PRIMARY KEY (salon_id);


--
-- TOC entry 3317 (class 2606 OID 33557)
-- Name: tokens_auth tokens_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT tokens_auth_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3319 (class 2606 OID 33573)
-- Name: tokens_auth tokens_auth_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT tokens_auth_token_key UNIQUE (token);


--
-- TOC entry 3335 (class 2606 OID 33575)
-- Name: ubicaciones ubicaciones_nombre_edificio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT ubicaciones_nombre_edificio_key UNIQUE (nombre_edificio);


--
-- TOC entry 3337 (class 2606 OID 33559)
-- Name: ubicaciones ubicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT ubicaciones_pkey PRIMARY KEY (ubicacion_id);


--
-- TOC entry 3345 (class 2606 OID 33577)
-- Name: horarios uq_horario_profesor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT uq_horario_profesor UNIQUE (profesor_id, dia_semana, hora_inicio);


--
-- TOC entry 3347 (class 2606 OID 33579)
-- Name: horarios uq_horario_salon; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT uq_horario_salon UNIQUE (salon_id, dia_semana, hora_inicio);


--
-- TOC entry 3341 (class 2606 OID 33581)
-- Name: salones uq_salon_ubicacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT uq_salon_ubicacion UNIQUE (nombre_salon, ubicacion_id);


--
-- TOC entry 3313 (class 2606 OID 33583)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3315 (class 2606 OID 33561)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 3363 (class 2606 OID 57360)
-- Name: carrera_materias carrera_materias_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id) ON DELETE CASCADE;


--
-- TOC entry 3364 (class 2606 OID 57365)
-- Name: carrera_materias carrera_materias_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3360 (class 2606 OID 65536)
-- Name: horarios fk_materia_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_materia_horario FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 65541)
-- Name: profesor_materias fk_materia_preferencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT fk_materia_preferencia FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 33599)
-- Name: horarios fk_profesor_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_profesor_horario FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 33604)
-- Name: profesor_materias fk_profesor_preferencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT fk_profesor_preferencia FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


--
-- TOC entry 3354 (class 2606 OID 33609)
-- Name: usuarios fk_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE RESTRICT;


--
-- TOC entry 3362 (class 2606 OID 33614)
-- Name: horarios fk_salon_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_salon_horario FOREIGN KEY (salon_id) REFERENCES public.salones(salon_id) ON DELETE RESTRICT;


--
-- TOC entry 3359 (class 2606 OID 33619)
-- Name: salones fk_ubicacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT fk_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES public.ubicaciones(ubicacion_id) ON DELETE RESTRICT;


--
-- TOC entry 3356 (class 2606 OID 33624)
-- Name: profesores fk_usuario_profesor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT fk_usuario_profesor FOREIGN KEY (profesor_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 3355 (class 2606 OID 33629)
-- Name: tokens_auth fk_usuario_token; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


-- Completed on 2025-10-16 04:06:21 CST

--
-- PostgreSQL database dump complete
--

\unrestrict qtObnqtMxLisDOMNBlaRIwqjrPbVy7nXkppxK70eSH4uRkzztBDt8LQEyZ7Lfi2

