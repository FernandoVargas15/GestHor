--
-- PostgreSQL database dump
--

\restrict n1A5Yj0K8wgcR6EHpVmM7Y5O1wt2py8PE1pio4orU5EHP3HgJSCtg9WDhI5ED4G

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

-- Started on 2025-10-16 08:51:46 CST

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
-- TOC entry 3563 (class 1262 OID 32768)
-- Name: GestHor; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "GestHor" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';


ALTER DATABASE "GestHor" OWNER TO postgres;

\unrestrict n1A5Yj0K8wgcR6EHpVmM7Y5O1wt2py8PE1pio4orU5EHP3HgJSCtg9WDhI5ED4G
\connect "GestHor"
\restrict n1A5Yj0K8wgcR6EHpVmM7Y5O1wt2py8PE1pio4orU5EHP3HgJSCtg9WDhI5ED4G

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
-- TOC entry 3564 (class 0 OID 0)
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
-- TOC entry 3565 (class 0 OID 0)
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
    nombre_materia character varying(255) NOT NULL
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
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 232
-- Name: materias_catalogo_materia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materias_catalogo_materia_id_seq OWNED BY public.materias_catalogo.materia_id;


--
-- TOC entry 236 (class 1259 OID 65547)
-- Name: profesor_disponibilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesor_disponibilidad (
    disponibilidad_id integer NOT NULL,
    profesor_id integer NOT NULL,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    activo boolean DEFAULT true,
    turno character varying(20),
    CONSTRAINT check_horario_valido CHECK ((hora_fin > hora_inicio)),
    CONSTRAINT profesor_disponibilidad_turno_check CHECK (((turno)::text = ANY ((ARRAY['matutino'::character varying, 'vespertino'::character varying, 'nocturno'::character varying])::text[])))
);


ALTER TABLE public.profesor_disponibilidad OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 65546)
-- Name: profesor_disponibilidad_disponibilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesor_disponibilidad_disponibilidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesor_disponibilidad_disponibilidad_id_seq OWNER TO postgres;

--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 235
-- Name: profesor_disponibilidad_disponibilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesor_disponibilidad_disponibilidad_id_seq OWNED BY public.profesor_disponibilidad.disponibilidad_id;


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
-- TOC entry 238 (class 1259 OID 65566)
-- Name: profesor_preferencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesor_preferencias (
    preferencia_id integer NOT NULL,
    profesor_id integer NOT NULL,
    max_horas_dia integer DEFAULT 8,
    preferencia_horario character varying(20) DEFAULT 'Mixto'::character varying,
    comentarios_adicionales text
);


ALTER TABLE public.profesor_preferencias OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 65565)
-- Name: profesor_preferencias_preferencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesor_preferencias_preferencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesor_preferencias_preferencia_id_seq OWNER TO postgres;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 237
-- Name: profesor_preferencias_preferencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesor_preferencias_preferencia_id_seq OWNED BY public.profesor_preferencias.preferencia_id;


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
-- TOC entry 3569 (class 0 OID 0)
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
-- TOC entry 3570 (class 0 OID 0)
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
-- TOC entry 3571 (class 0 OID 0)
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
-- TOC entry 3572 (class 0 OID 0)
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
-- TOC entry 3573 (class 0 OID 0)
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
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_usuario_id_seq OWNED BY public.usuarios.usuario_id;


--
-- TOC entry 3311 (class 2604 OID 33534)
-- Name: carreras carrera_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN carrera_id SET DEFAULT nextval('public.carreras_carrera_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 33535)
-- Name: horarios horario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN horario_id SET DEFAULT nextval('public.horarios_horario_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 57348)
-- Name: materias_catalogo materia_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo ALTER COLUMN materia_id SET DEFAULT nextval('public.materias_catalogo_materia_id_seq'::regclass);


--
-- TOC entry 3316 (class 2604 OID 65550)
-- Name: profesor_disponibilidad disponibilidad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_disponibilidad ALTER COLUMN disponibilidad_id SET DEFAULT nextval('public.profesor_disponibilidad_disponibilidad_id_seq'::regclass);


--
-- TOC entry 3318 (class 2604 OID 65569)
-- Name: profesor_preferencias preferencia_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_preferencias ALTER COLUMN preferencia_id SET DEFAULT nextval('public.profesor_preferencias_preferencia_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 49161)
-- Name: profesores profesor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores ALTER COLUMN profesor_id SET DEFAULT nextval('public.profesores_profesor_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 33537)
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 33538)
-- Name: salones salon_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones ALTER COLUMN salon_id SET DEFAULT nextval('public.salones_salon_id_seq'::regclass);


--
-- TOC entry 3308 (class 2604 OID 33539)
-- Name: tokens_auth token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth ALTER COLUMN token_id SET DEFAULT nextval('public.tokens_auth_token_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 33540)
-- Name: ubicaciones ubicacion_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones ALTER COLUMN ubicacion_id SET DEFAULT nextval('public.ubicaciones_ubicacion_id_seq'::regclass);


--
-- TOC entry 3306 (class 2604 OID 33541)
-- Name: usuarios usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuarios_usuario_id_seq'::regclass);


--
-- TOC entry 3553 (class 0 OID 57354)
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
8	22	1
\.


--
-- TOC entry 3541 (class 0 OID 33511)
-- Dependencies: 222
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carreras (carrera_id, nombre_carrera, total_semestres) FROM stdin;
5	Ingenieria en sistemas	6
6	Licenciatura en Caficultura	8
7	Ingeniero Agrónomo en Ganadería Ambiental	9
8	Ingeniero en Desarrollo Agroambiental	9
9	Ingeniería en Desarrollo Rural	9
10	Ingeniería Agroindustrial	9
11	Ingeniería Forestal	9
12	Ingeniero Agrónomo	9
13	Medicina Veterinaria y Zootecnia (Maya)	10
14	Medicina Veterinaria y Zootecnia (Mezcalapa)	10
15	Licenciatura en Medicina Veterinaria y Zootecnia	10
16	Licenciatura en Gerontología	8
17	Licenciatura en Médico Cirujano	12
18	Licenciatura en Químico Farmacobiólogo	9
19	Licenciatura en Enseñanza del Inglés	8
20	Arquitectura	10
21	Ingeniería Civil	10
22	Ingeniería Hidráulica	9
23	Ingeniería en Ciencias de los Materiales	9
24	Licenciatura en Antropología Social	8
25	Licenciatura en Bibliotecología y Gestión de Información	8
26	Licenciatura en Comunicación	8
27	Licenciatura en Economía	9
28	Licenciatura en Historia	8
29	Licenciatura en Filosofía	8
30	Licenciatura en Lengua y Literatura Hispanoamericanas	8
31	Licenciatura en Pedagogía	8
32	Licenciatura en Puericultura y Desarrollo Infantil	8
33	Licenciatura en Sociología	8
34	Licenciatura en Derecho	10
35	Licenciatura en Administración	8
36	Licenciatura en Agronegocios	8
37	Licenciatura en Comercio Internacional	8
38	Licenciatura en Contaduría	8
39	Licenciatura en Gestión Turística	8
40	Licenciatura en Sistemas Computacionales	9
41	Ingeniería en Desarrollo y Tecnologías de Software	9
42	Licenciatura en Danza	8
43	Licenciatura en Gestión y Autodesarrollo Indígena	8
44	Licenciatura en Gestión para el Desarrollo y la Diversidad	8
45	Licenciatura en Seguridad Alimentaria	8
46	Licenciatura en Desarrollo Municipal y Gobernabilidad	8
47	Licenciatura en Tecnologías de Información y Comunicación Aplicadas a la Educación	8
48	Licenciatura en Gerencia Social	8
49	Licenciatura en Estadística y Sistemas de Información	9
50	Licenciatura en Gestión de la Micro, Pequeña y Mediana Empresa	8
51	Licenciatura en Inglés	8
52	Licenciatura en Derechos Humanos	8
53	Licenciatura en Física	9
54	Ingeniero en Sistemas Costeros	9
55	Ingeniería Física	9
56	Ingeniero Biotecnólogo	9
57	Matemáticas Aplicadas	9
58	Licenciatura en Matemáticas	8
\.


--
-- TOC entry 3548 (class 0 OID 33530)
-- Dependencies: 229
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios (horario_id, profesor_id, materia_id, salon_id, dia_semana, hora_inicio, hora_fin) FROM stdin;
\.


--
-- TOC entry 3552 (class 0 OID 57345)
-- Dependencies: 233
-- Data for Name: materias_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materias_catalogo (materia_id, nombre_materia) FROM stdin;
5	Matematicas
6	FISICA
7	MATEMATICAS DISCRETAS
8	PROGRAMACION ESTRUCTURADA
9	FUNDAMENTOS DE MATEMATICAS
10	METODOLOGIA DE LA PROGRAMACION
11	TALLER DE COMPETENCIAS INFORMACIONALES
12	ÁLGEBRA LINEAL
13	ESTRUCTURA DE DATOS
14	CALCULO DIFERENCIAL
15	PROGRAMACION ORIENTADA A OBJETOS
16	ELECTRICIDAD Y ELECTRONICA
17	TALLER DE METODOLOGIA DE LA INVESTIGACION
18	METODOS NUMERICOS
19	CALCULO INTEGRAL
20	SISTEMAS DIGITALES
21	DISEÑO DE BASES DE DATOS
22	DESARROLLO HUMANO
23	PROGRAMACION AVANZADA
24	TALLER DE DESARROLLO 1
25	ARQUITECTURA DE COMPUTADORAS
26	ECUACIONES DIFERENCIALES
27	PROBABILIDAD Y ESTADISTICA
28	ADMINISTRACION DE BASES DE DATOS
29	PROGRAMACION DISTRIBUIDA Y EN PARALELO
30	ESTUDIO DE LAS ORGANIZACIONES
31	TALLER DE DESARROLLO 2
32	INVESTIGACION DE OPERACIONES
33	TEORIA MATEMATICA DE LA COMPUTACION
34	CALIDAD EN LOS PROCESOS DE DESARROLLO DE SOFTWARE
35	TRADUCTORES DE BAJO NIVEL
36	FUNDAMENTOS DE REDES
37	TOPICOS AVANZADOS DE BASES DE DATOS
38	TALLER DE DESARROLLO 3
39	PRACTICA PROFESIONAL 1
40	ECONOMIA
41	COMPILADORES
42	CONTABILIDAD Y FINANZAS
43	MODELOS Y METODOLOGIAS DE DESARROLLO DE SOFTWARE
44	PROTOCOLOS DE ENRUTAMIENTO
45	INTERFACES HUMANO COMPUTADORA
46	TALLER DE DESARROLLO 4
47	SISTEMAS OPERATIVOS
48	INTELIGENCIA ARTIFICIAL
49	DESARROLLO DE APLICACIONES WEB Y MOVILES
50	CONMUTADORES Y REDES INALAMBRICAS
51	PRACTICA PROFESIONAL 2
52	OPTATIVA 1
53	OPTATIVA 2
54	GRAFICACION
55	COMPUTO DISTRIBUIDO
56	ADMINISTRACION DE SISTEMAS OPERATIVOS
57	TALLER DE INVESTIGACION EN LAS CIENCIAS COMPUTACIONALES
58	OPTATIVA 3
59	OPTATIVA 4
60	OPTATIVA 5
\.


--
-- TOC entry 3555 (class 0 OID 65547)
-- Dependencies: 236
-- Data for Name: profesor_disponibilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesor_disponibilidad (disponibilidad_id, profesor_id, dia_semana, hora_inicio, hora_fin, activo, turno) FROM stdin;
36	12	Lunes	07:00:00	08:00:00	t	matutino
37	12	Martes	15:00:00	16:00:00	t	vespertino
\.


--
-- TOC entry 3543 (class 0 OID 33519)
-- Dependencies: 224
-- Data for Name: profesor_materias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesor_materias (profesor_id, materia_id) FROM stdin;
12	28
12	55
12	34
\.


--
-- TOC entry 3557 (class 0 OID 65566)
-- Dependencies: 238
-- Data for Name: profesor_preferencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesor_preferencias (preferencia_id, profesor_id, max_horas_dia, preferencia_horario, comentarios_adicionales) FROM stdin;
1	12	2	Matutino	ninguno aa
\.


--
-- TOC entry 3540 (class 0 OID 33506)
-- Dependencies: 221
-- Data for Name: profesores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profesores (profesor_id, nombres, apellidos, matricula, grado_academico, numero_plaza, numero_contrato, direccion, telefono, email) FROM stdin;
12	Jose	Clemente Corzo	100020762	Lic en software	ewrffewfew12	321321321312	Calle San Bernardino 261	9612215796	rubenclemente221@gmail.com
13	Rem cupidatat explic	Et expedita qui nost	Qui rerum id ea aut	Deserunt consectetur	Quia expedita eiusmo	Quibusdam assumenda 	Quis aut voluptate o	9612215796	wusega@unach.com
14	RIGOBERTO	PEREZ OVANDO 	Debitis dolore aut e	Non consequatur exp	565465464	Incidunt officia eu	Soluta est molestia	9612221579	rigoberto@unach.mx
\.


--
-- TOC entry 3534 (class 0 OID 33490)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (rol_id, nombre_rol) FROM stdin;
1	administrador
2	profesor
\.


--
-- TOC entry 3546 (class 0 OID 33526)
-- Dependencies: 227
-- Data for Name: salones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salones (salon_id, nombre_salon, ubicacion_id) FROM stdin;
\.


--
-- TOC entry 3538 (class 0 OID 33501)
-- Dependencies: 219
-- Data for Name: tokens_auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens_auth (token_id, usuario_id, token, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 3544 (class 0 OID 33522)
-- Dependencies: 225
-- Data for Name: ubicaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ubicaciones (ubicacion_id, nombre_edificio) FROM stdin;
\.


--
-- TOC entry 3536 (class 0 OID 33494)
-- Dependencies: 217
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (usuario_id, email, password, rol_id, fecha_creacion) FROM stdin;
2	admin@unach.mx	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	1	2025-10-12 00:52:53.83231-06
3	profe@unach.mx	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 00:53:37.286524-06
10	hidyt@mailinator.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 02:21:57.446188-06
11	fycibekix@mailinator.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-12 02:27:54.578438-06
12	rubenclemente221@gmail.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-13 05:06:39.903588-06
13	wusega@unach.com	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-16 04:48:48.519577-06
14	rigoberto@unach.mx	$2b$10$FCAhKuP1XlzHSgWDcKMwj.uQS2A2WhSTuLobPbdldayZsh14Y2I.G	2	2025-10-16 08:47:30.319158-06
\.


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 223
-- Name: carreras_carrera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carreras_carrera_id_seq', 58, true);


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 230
-- Name: horarios_horario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_horario_id_seq', 1, true);


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 232
-- Name: materias_catalogo_materia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materias_catalogo_materia_id_seq', 60, true);


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 235
-- Name: profesor_disponibilidad_disponibilidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesor_disponibilidad_disponibilidad_id_seq', 37, true);


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 237
-- Name: profesor_preferencias_preferencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesor_preferencias_preferencia_id_seq', 1, true);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 231
-- Name: profesores_profesor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profesores_profesor_id_seq', 7, true);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_rol_id_seq', 2, true);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 228
-- Name: salones_salon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salones_salon_id_seq', 1, false);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 220
-- Name: tokens_auth_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_auth_token_id_seq', 1, false);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 226
-- Name: ubicaciones_ubicacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ubicaciones_ubicacion_id_seq', 1, false);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_usuario_id_seq', 14, true);


--
-- TOC entry 3369 (class 2606 OID 57359)
-- Name: carrera_materias carrera_materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_pkey PRIMARY KEY (carrera_id, materia_id, numero_semestre);


--
-- TOC entry 3345 (class 2606 OID 33563)
-- Name: carreras carreras_nombre_carrera_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_nombre_carrera_key UNIQUE (nombre_carrera);


--
-- TOC entry 3347 (class 2606 OID 33543)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (carrera_id);


--
-- TOC entry 3359 (class 2606 OID 33545)
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (horario_id);


--
-- TOC entry 3365 (class 2606 OID 57353)
-- Name: materias_catalogo materias_catalogo_nombre_materia_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo
    ADD CONSTRAINT materias_catalogo_nombre_materia_key UNIQUE (nombre_materia);


--
-- TOC entry 3367 (class 2606 OID 57351)
-- Name: materias_catalogo materias_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materias_catalogo
    ADD CONSTRAINT materias_catalogo_pkey PRIMARY KEY (materia_id);


--
-- TOC entry 3371 (class 2606 OID 65555)
-- Name: profesor_disponibilidad profesor_disponibilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_disponibilidad
    ADD CONSTRAINT profesor_disponibilidad_pkey PRIMARY KEY (disponibilidad_id);


--
-- TOC entry 3349 (class 2606 OID 33549)
-- Name: profesor_materias profesor_materias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT profesor_materias_pkey PRIMARY KEY (profesor_id, materia_id);


--
-- TOC entry 3375 (class 2606 OID 65575)
-- Name: profesor_preferencias profesor_preferencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_preferencias
    ADD CONSTRAINT profesor_preferencias_pkey PRIMARY KEY (preferencia_id);


--
-- TOC entry 3377 (class 2606 OID 65577)
-- Name: profesor_preferencias profesor_preferencias_profesor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_preferencias
    ADD CONSTRAINT profesor_preferencias_profesor_id_key UNIQUE (profesor_id);


--
-- TOC entry 3337 (class 2606 OID 33565)
-- Name: profesores profesores_matricula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_matricula_key UNIQUE (matricula);


--
-- TOC entry 3339 (class 2606 OID 33567)
-- Name: profesores profesores_numero_contrato_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_numero_contrato_key UNIQUE (numero_contrato);


--
-- TOC entry 3341 (class 2606 OID 33569)
-- Name: profesores profesores_numero_plaza_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_numero_plaza_key UNIQUE (numero_plaza);


--
-- TOC entry 3343 (class 2606 OID 33551)
-- Name: profesores profesores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT profesores_pkey PRIMARY KEY (profesor_id);


--
-- TOC entry 3325 (class 2606 OID 33571)
-- Name: roles roles_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 3327 (class 2606 OID 33553)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- TOC entry 3355 (class 2606 OID 33555)
-- Name: salones salones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT salones_pkey PRIMARY KEY (salon_id);


--
-- TOC entry 3333 (class 2606 OID 33557)
-- Name: tokens_auth tokens_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT tokens_auth_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3335 (class 2606 OID 33573)
-- Name: tokens_auth tokens_auth_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT tokens_auth_token_key UNIQUE (token);


--
-- TOC entry 3351 (class 2606 OID 33575)
-- Name: ubicaciones ubicaciones_nombre_edificio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT ubicaciones_nombre_edificio_key UNIQUE (nombre_edificio);


--
-- TOC entry 3353 (class 2606 OID 33559)
-- Name: ubicaciones ubicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ubicaciones
    ADD CONSTRAINT ubicaciones_pkey PRIMARY KEY (ubicacion_id);


--
-- TOC entry 3373 (class 2606 OID 65557)
-- Name: profesor_disponibilidad uq_disponibilidad_profesor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_disponibilidad
    ADD CONSTRAINT uq_disponibilidad_profesor UNIQUE (profesor_id, dia_semana, hora_inicio);


--
-- TOC entry 3361 (class 2606 OID 33577)
-- Name: horarios uq_horario_profesor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT uq_horario_profesor UNIQUE (profesor_id, dia_semana, hora_inicio);


--
-- TOC entry 3363 (class 2606 OID 33579)
-- Name: horarios uq_horario_salon; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT uq_horario_salon UNIQUE (salon_id, dia_semana, hora_inicio);


--
-- TOC entry 3357 (class 2606 OID 33581)
-- Name: salones uq_salon_ubicacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT uq_salon_ubicacion UNIQUE (nombre_salon, ubicacion_id);


--
-- TOC entry 3329 (class 2606 OID 33583)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3331 (class 2606 OID 33561)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 3387 (class 2606 OID 57360)
-- Name: carrera_materias carrera_materias_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(carrera_id) ON DELETE CASCADE;


--
-- TOC entry 3388 (class 2606 OID 57365)
-- Name: carrera_materias carrera_materias_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrera_materias
    ADD CONSTRAINT carrera_materias_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 65536)
-- Name: horarios fk_materia_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_materia_horario FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3381 (class 2606 OID 65541)
-- Name: profesor_materias fk_materia_preferencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT fk_materia_preferencia FOREIGN KEY (materia_id) REFERENCES public.materias_catalogo(materia_id) ON DELETE CASCADE;


--
-- TOC entry 3389 (class 2606 OID 65558)
-- Name: profesor_disponibilidad fk_profesor_disponibilidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_disponibilidad
    ADD CONSTRAINT fk_profesor_disponibilidad FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 33599)
-- Name: horarios fk_profesor_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_profesor_horario FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


--
-- TOC entry 3382 (class 2606 OID 33604)
-- Name: profesor_materias fk_profesor_preferencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_materias
    ADD CONSTRAINT fk_profesor_preferencia FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


--
-- TOC entry 3378 (class 2606 OID 33609)
-- Name: usuarios fk_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE RESTRICT;


--
-- TOC entry 3386 (class 2606 OID 33614)
-- Name: horarios fk_salon_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT fk_salon_horario FOREIGN KEY (salon_id) REFERENCES public.salones(salon_id) ON DELETE RESTRICT;


--
-- TOC entry 3383 (class 2606 OID 33619)
-- Name: salones fk_ubicacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salones
    ADD CONSTRAINT fk_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES public.ubicaciones(ubicacion_id) ON DELETE RESTRICT;


--
-- TOC entry 3380 (class 2606 OID 33624)
-- Name: profesores fk_usuario_profesor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesores
    ADD CONSTRAINT fk_usuario_profesor FOREIGN KEY (profesor_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 3379 (class 2606 OID 33629)
-- Name: tokens_auth fk_usuario_token; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens_auth
    ADD CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 3390 (class 2606 OID 65578)
-- Name: profesor_preferencias profesor_preferencias_profesor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor_preferencias
    ADD CONSTRAINT profesor_preferencias_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.profesores(profesor_id) ON DELETE CASCADE;


-- Completed on 2025-10-16 08:51:46 CST

--
-- PostgreSQL database dump complete
--

\unrestrict n1A5Yj0K8wgcR6EHpVmM7Y5O1wt2py8PE1pio4orU5EHP3HgJSCtg9WDhI5ED4G

