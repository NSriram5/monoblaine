--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

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
-- Name: deck; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.deck (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    visibility character varying(10) NOT NULL,
    description text,
    user_id integer NOT NULL
);


ALTER TABLE public.deck OWNER TO artain;

--
-- Name: deck_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.deck_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.deck_id_seq OWNER TO artain;

--
-- Name: deck_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.deck_id_seq OWNED BY public.deck.id;


--
-- Name: fakeout; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.fakeout (
    id integer NOT NULL,
    fake_word text NOT NULL,
    hypernym text,
    relationship character varying(20),
    my_keyword_id integer
);


ALTER TABLE public.fakeout OWNER TO artain;

--
-- Name: fakeout_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.fakeout_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fakeout_id_seq OWNER TO artain;

--
-- Name: fakeout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.fakeout_id_seq OWNED BY public.fakeout.id;


--
-- Name: joindecknugget; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.joindecknugget (
    id integer NOT NULL,
    my_deck integer,
    my_nugget integer
);


ALTER TABLE public.joindecknugget OWNER TO artain;

--
-- Name: joindecknugget_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.joindecknugget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.joindecknugget_id_seq OWNER TO artain;

--
-- Name: joindecknugget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.joindecknugget_id_seq OWNED BY public.joindecknugget.id;


--
-- Name: joindeckquestion; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.joindeckquestion (
    id integer NOT NULL,
    my_question integer,
    my_deck integer
);


ALTER TABLE public.joindeckquestion OWNER TO artain;

--
-- Name: joindeckquestion_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.joindeckquestion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.joindeckquestion_id_seq OWNER TO artain;

--
-- Name: joindeckquestion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.joindeckquestion_id_seq OWNED BY public.joindeckquestion.id;


--
-- Name: joindeckquiz; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.joindeckquiz (
    id integer NOT NULL,
    my_quiz integer,
    my_deck integer
);


ALTER TABLE public.joindeckquiz OWNER TO artain;

--
-- Name: joindeckquiz_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.joindeckquiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.joindeckquiz_id_seq OWNER TO artain;

--
-- Name: joindeckquiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.joindeckquiz_id_seq OWNED BY public.joindeckquiz.id;


--
-- Name: joindeckuser; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.joindeckuser (
    id integer NOT NULL,
    my_deck integer,
    access_user integer
);


ALTER TABLE public.joindeckuser OWNER TO artain;

--
-- Name: joindeckuser_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.joindeckuser_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.joindeckuser_id_seq OWNER TO artain;

--
-- Name: joindeckuser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.joindeckuser_id_seq OWNED BY public.joindeckuser.id;


--
-- Name: keyword; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.keyword (
    id integer NOT NULL,
    word character varying(100) NOT NULL,
    place_in_sentence integer,
    instance_count character varying(10),
    part_of_speech character varying(5),
    hypernym text,
    my_nugget integer
);


ALTER TABLE public.keyword OWNER TO artain;

--
-- Name: keyword_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.keyword_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.keyword_id_seq OWNER TO artain;

--
-- Name: keyword_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.keyword_id_seq OWNED BY public.keyword.id;


--
-- Name: nugget; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.nugget (
    id integer NOT NULL,
    truth text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.nugget OWNER TO artain;

--
-- Name: nugget_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.nugget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nugget_id_seq OWNER TO artain;

--
-- Name: nugget_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.nugget_id_seq OWNED BY public.nugget.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.question (
    id integer NOT NULL,
    name character varying(100),
    times_asked integer,
    times_correct integer,
    my_nugget integer
);


ALTER TABLE public.question OWNER TO artain;

--
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_id_seq OWNER TO artain;

--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.question_id_seq OWNED BY public.question.id;


--
-- Name: quiz; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.quiz (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.quiz OWNER TO artain;

--
-- Name: quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.quiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quiz_id_seq OWNER TO artain;

--
-- Name: quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.quiz_id_seq OWNED BY public.quiz.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: artain
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO artain;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: artain
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO artain;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: artain
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: deck id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.deck ALTER COLUMN id SET DEFAULT nextval('public.deck_id_seq'::regclass);


--
-- Name: fakeout id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.fakeout ALTER COLUMN id SET DEFAULT nextval('public.fakeout_id_seq'::regclass);


--
-- Name: joindecknugget id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindecknugget ALTER COLUMN id SET DEFAULT nextval('public.joindecknugget_id_seq'::regclass);


--
-- Name: joindeckquestion id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquestion ALTER COLUMN id SET DEFAULT nextval('public.joindeckquestion_id_seq'::regclass);


--
-- Name: joindeckquiz id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquiz ALTER COLUMN id SET DEFAULT nextval('public.joindeckquiz_id_seq'::regclass);


--
-- Name: joindeckuser id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckuser ALTER COLUMN id SET DEFAULT nextval('public.joindeckuser_id_seq'::regclass);


--
-- Name: keyword id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.keyword ALTER COLUMN id SET DEFAULT nextval('public.keyword_id_seq'::regclass);


--
-- Name: nugget id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.nugget ALTER COLUMN id SET DEFAULT nextval('public.nugget_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.question ALTER COLUMN id SET DEFAULT nextval('public.question_id_seq'::regclass);


--
-- Name: quiz id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.quiz ALTER COLUMN id SET DEFAULT nextval('public.quiz_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: deck; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.deck (id, name, visibility, description, user_id) FROM stdin;
1	Washington Facts	Public	Facts about the great state of Washington	1
2	Tennessee Facts	Private	Facts about the great state of Tennessee	1
3	Kansas Facts	Public	Facts about the great state of Kansas	1
4	Javascript History	Public	A deck about the history of javascript	1
\.


--
-- Data for Name: fakeout; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.fakeout (id, fake_word, hypernym, relationship, my_keyword_id) FROM stdin;
5	Trombone	\N	\N	3
6	Evergreen	\N	\N	3
7	Sunflower	\N	\N	3
8	rivers			2
9	jungles			2
10	deserts			2
1	laws against skateboarding	some places	HasA	\N
11	dynamic			4
12	specialized			4
13	controlled			5
14	unilateral			5
15	unopinionated			5
16	dynamic			6
17	styling			6
18	structure			6
19	Clojure			7
20	Haskell			7
21	Pliant	a functional programming language	IsA	8
\.


--
-- Data for Name: joindecknugget; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.joindecknugget (id, my_deck, my_nugget) FROM stdin;
1	2	1
2	2	2
3	4	3
4	4	4
5	4	5
6	4	6
\.


--
-- Data for Name: joindeckquestion; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.joindeckquestion (id, my_question, my_deck) FROM stdin;
\.


--
-- Data for Name: joindeckquiz; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.joindeckquiz (id, my_quiz, my_deck) FROM stdin;
\.


--
-- Data for Name: joindeckuser; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.joindeckuser (id, my_deck, access_user) FROM stdin;
\.


--
-- Data for Name: keyword; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.keyword (id, word, place_in_sentence, instance_count, part_of_speech, hypernym, my_nugget) FROM stdin;
2	mountains	\N	All	\N	\N	1
3	Volunteer	\N	All	\N	\N	2
4	interactive	\N	All	\N	\N	3
5	multi-paradigm	\N	All	\N	\N	4
6	scripting	\N	All	\N	\N	5
7	Scheme	\N	All	\N	\N	6
8	scheme	18	All	\N	\N	6
\.


--
-- Data for Name: nugget; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.nugget (id, truth, user_id) FROM stdin;
1	Eastern Tennessee has many mountains	1
2	Tennessee is known as the Volunteer state	1
3	JavaScript enables interactive web pages and is an essential part of web applications.	1
4	JavaScript is a multi-paradigm language	1
5	The first browser to use a scripting language was Netscape Navigator	1
6	Brenden Eich was hired at Netscape to embed the Scheme language	1
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.question (id, name, times_asked, times_correct, my_nugget) FROM stdin;
\.


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.quiz (id, name) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: artain
--

COPY public.users (id, email, username, password) FROM stdin;
1	artain5@gmail.com	artain	$2b$12$uJbanvuza7/jnRGghAh8AOFJ5TG3zgicZvABdeWzFepxqCPp2gEyu
\.


--
-- Name: deck_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.deck_id_seq', 4, true);


--
-- Name: fakeout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.fakeout_id_seq', 21, true);


--
-- Name: joindecknugget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.joindecknugget_id_seq', 6, true);


--
-- Name: joindeckquestion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.joindeckquestion_id_seq', 1, false);


--
-- Name: joindeckquiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.joindeckquiz_id_seq', 1, false);


--
-- Name: joindeckuser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.joindeckuser_id_seq', 1, false);


--
-- Name: keyword_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.keyword_id_seq', 8, true);


--
-- Name: nugget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.nugget_id_seq', 6, true);


--
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.question_id_seq', 1, false);


--
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.quiz_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: artain
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: deck deck_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_pkey PRIMARY KEY (id);


--
-- Name: fakeout fakeout_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.fakeout
    ADD CONSTRAINT fakeout_pkey PRIMARY KEY (id);


--
-- Name: joindecknugget joindecknugget_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindecknugget
    ADD CONSTRAINT joindecknugget_pkey PRIMARY KEY (id);


--
-- Name: joindeckquestion joindeckquestion_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquestion
    ADD CONSTRAINT joindeckquestion_pkey PRIMARY KEY (id);


--
-- Name: joindeckquiz joindeckquiz_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquiz
    ADD CONSTRAINT joindeckquiz_pkey PRIMARY KEY (id);


--
-- Name: joindeckuser joindeckuser_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckuser
    ADD CONSTRAINT joindeckuser_pkey PRIMARY KEY (id);


--
-- Name: keyword keyword_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.keyword
    ADD CONSTRAINT keyword_pkey PRIMARY KEY (id);


--
-- Name: nugget nugget_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.nugget
    ADD CONSTRAINT nugget_pkey PRIMARY KEY (id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: quiz quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.quiz
    ADD CONSTRAINT quiz_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: deck deck_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fakeout fakeout_my_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.fakeout
    ADD CONSTRAINT fakeout_my_keyword_id_fkey FOREIGN KEY (my_keyword_id) REFERENCES public.keyword(id) ON DELETE CASCADE;


--
-- Name: joindecknugget joindecknugget_my_deck_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindecknugget
    ADD CONSTRAINT joindecknugget_my_deck_fkey FOREIGN KEY (my_deck) REFERENCES public.deck(id) ON DELETE CASCADE;


--
-- Name: joindecknugget joindecknugget_my_nugget_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindecknugget
    ADD CONSTRAINT joindecknugget_my_nugget_fkey FOREIGN KEY (my_nugget) REFERENCES public.nugget(id) ON DELETE CASCADE;


--
-- Name: joindeckquestion joindeckquestion_my_deck_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquestion
    ADD CONSTRAINT joindeckquestion_my_deck_fkey FOREIGN KEY (my_deck) REFERENCES public.deck(id) ON DELETE CASCADE;


--
-- Name: joindeckquestion joindeckquestion_my_question_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquestion
    ADD CONSTRAINT joindeckquestion_my_question_fkey FOREIGN KEY (my_question) REFERENCES public.question(id) ON DELETE CASCADE;


--
-- Name: joindeckquiz joindeckquiz_my_deck_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquiz
    ADD CONSTRAINT joindeckquiz_my_deck_fkey FOREIGN KEY (my_deck) REFERENCES public.deck(id) ON DELETE CASCADE;


--
-- Name: joindeckquiz joindeckquiz_my_quiz_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckquiz
    ADD CONSTRAINT joindeckquiz_my_quiz_fkey FOREIGN KEY (my_quiz) REFERENCES public.quiz(id) ON DELETE CASCADE;


--
-- Name: joindeckuser joindeckuser_access_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckuser
    ADD CONSTRAINT joindeckuser_access_user_fkey FOREIGN KEY (access_user) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: joindeckuser joindeckuser_my_deck_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.joindeckuser
    ADD CONSTRAINT joindeckuser_my_deck_fkey FOREIGN KEY (my_deck) REFERENCES public.deck(id) ON DELETE CASCADE;


--
-- Name: keyword keyword_my_nugget_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.keyword
    ADD CONSTRAINT keyword_my_nugget_fkey FOREIGN KEY (my_nugget) REFERENCES public.nugget(id) ON DELETE CASCADE;


--
-- Name: nugget nugget_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.nugget
    ADD CONSTRAINT nugget_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: question question_my_nugget_fkey; Type: FK CONSTRAINT; Schema: public; Owner: artain
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_my_nugget_fkey FOREIGN KEY (my_nugget) REFERENCES public.nugget(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

