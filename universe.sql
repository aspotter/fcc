--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-0ubuntu0.20.04.1)

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

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

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
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(30) NOT NULL,
    distance_from_earth_mpc numeric(4,3),
    diameter_ly integer NOT NULL,
    apparent_magnitude numeric(4,2),
    local_group boolean NOT NULL
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    name character varying(20) NOT NULL,
    mass_earths numeric(7,6),
    radius_earths numeric(5,4),
    orbital_period_days numeric(5,3),
    planet_id integer
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    name character varying(20) NOT NULL,
    mass_earths numeric(6,3),
    radius_earths numeric(6,4),
    rotational_period_days numeric(6,3),
    orbital_period_days numeric(8,3),
    has_life boolean NOT NULL,
    star_id integer
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: space_station; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.space_station (
    space_station_id integer NOT NULL,
    name character varying(20) NOT NULL,
    active boolean NOT NULL,
    mass_kg integer NOT NULL,
    planet_id integer
);


ALTER TABLE public.space_station OWNER TO freecodecamp;

--
-- Name: space_station_station_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.space_station_station_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.space_station_station_id_seq OWNER TO freecodecamp;

--
-- Name: space_station_station_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.space_station_station_id_seq OWNED BY public.space_station.space_station_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    name character varying(20) NOT NULL,
    constellation character varying(20),
    distance_pc numeric(8,2),
    radius_solar_units numeric(5,3) NOT NULL,
    mass_solar_units numeric(6,4) NOT NULL,
    temperature_k integer NOT NULL,
    description text,
    galaxy_id integer
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_star_id_seq OWNER TO freecodecamp;

--
-- Name: star_star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_star_id_seq OWNED BY public.star.star_id;


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_galaxy_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_planet_id_seq'::regclass);


--
-- Name: space_station space_station_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.space_station ALTER COLUMN space_station_id SET DEFAULT nextval('public.space_station_station_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_star_id_seq'::regclass);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 0.008, 87400, NULL, true);
INSERT INTO public.galaxy VALUES (2, 'Andromeda', 0.778, 152000, 4.17, true);
INSERT INTO public.galaxy VALUES (3, 'Triangulum', 0.840, 61100, 6.19, true);
INSERT INTO public.galaxy VALUES (4, 'Centaurus A', 3.680, 60000, 6.84, false);
INSERT INTO public.galaxy VALUES (5, 'Large Magellanic Cloud', 0.050, 32200, 0.90, true);
INSERT INTO public.galaxy VALUES (6, 'Dwingeloo 1', 2.800, 35000, 19.80, false);


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 'Moon', 0.012300, 0.2727, 27.321, 3);
INSERT INTO public.moon VALUES (2, 'Phobos', 0.000000, 0.0021, 0.318, 4);
INSERT INTO public.moon VALUES (3, 'Deimos', 0.000000, 0.0010, 1.263, 4);
INSERT INTO public.moon VALUES (4, 'Europa', 0.008000, 0.2450, 3.551, 5);
INSERT INTO public.moon VALUES (5, 'Ganymede', 0.025000, 0.4130, 7.155, 5);
INSERT INTO public.moon VALUES (6, 'Callisto', 0.018000, 0.3780, 16.689, 5);
INSERT INTO public.moon VALUES (7, 'Io', 0.015000, 0.2859, 1.769, 5);
INSERT INTO public.moon VALUES (8, 'Titan', 0.022500, 0.4040, 15.945, 6);
INSERT INTO public.moon VALUES (9, 'Enceladus', 0.000018, 0.0395, 1.370, 6);
INSERT INTO public.moon VALUES (10, 'Rhea', 0.000390, 0.1198, 4.518, 6);
INSERT INTO public.moon VALUES (11, 'Iapetus', 0.000302, 0.1152, 79.322, 6);
INSERT INTO public.moon VALUES (12, 'Titania', 0.000593, 0.1235, 8.706, 7);
INSERT INTO public.moon VALUES (13, 'Oberon', 0.000515, 0.1194, 13.463, 7);
INSERT INTO public.moon VALUES (14, 'Umbriel', 0.000213, 0.0920, 4.144, 7);
INSERT INTO public.moon VALUES (15, 'Ariel', 0.000209, 0.0908, 2.520, 7);
INSERT INTO public.moon VALUES (16, 'Triton', 0.003590, 0.2122, 5.877, 8);
INSERT INTO public.moon VALUES (17, 'Dione', 0.000183, 0.0881, 2.737, 6);
INSERT INTO public.moon VALUES (18, 'Tethys', 0.000103, 0.0834, 1.888, 6);
INSERT INTO public.moon VALUES (19, 'Proteus', 0.000007, 0.0330, 1.122, 8);
INSERT INTO public.moon VALUES (20, 'Miranda', 0.000011, 0.0370, 1.413, 7);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 'Mercury', 0.055, 0.3829, 176.000, 87.969, false, 2);
INSERT INTO public.planet VALUES (2, 'Venus', 0.815, 0.9499, 243.000, 224.700, false, 2);
INSERT INTO public.planet VALUES (3, 'Earth', 1.000, 1.0000, 1.000, 365.260, true, 2);
INSERT INTO public.planet VALUES (4, 'Mars', 0.107, 0.5320, 1.026, 687.000, false, 2);
INSERT INTO public.planet VALUES (5, 'Jupiter', 317.800, 10.9730, 0.414, 4332.590, false, 2);
INSERT INTO public.planet VALUES (6, 'Saturn', 95.159, 9.1402, 0.439, 10755.700, false, 2);
INSERT INTO public.planet VALUES (7, 'Uranus', 14.536, 4.0070, 0.718, 84.021, false, 2);
INSERT INTO public.planet VALUES (8, 'Neptune', 17.147, 3.8830, 0.671, 164.790, false, 2);
INSERT INTO public.planet VALUES (9, 'Kepler-90 b', NULL, 1.3100, NULL, 7.008, false, 4);
INSERT INTO public.planet VALUES (10, 'Kepler-90 g', 15.000, 8.1300, NULL, 210.600, false, 4);
INSERT INTO public.planet VALUES (11, 'Kepler-90 h', 203.000, 11.3200, NULL, 331.600, false, 4);
INSERT INTO public.planet VALUES (12, 'Proxima Centauri d', 0.260, 0.8100, NULL, 5.122, false, 3);
INSERT INTO public.planet VALUES (13, 'Proxima Centauri b', 1.070, 1.3000, NULL, 11.184, false, 3);
INSERT INTO public.planet VALUES (14, 'TRAPPIST-1 f', 1.039, 1.0450, NULL, 9.208, false, 5);


--
-- Data for Name: space_station; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.space_station VALUES (1, 'ISS', true, 450000, 3);
INSERT INTO public.space_station VALUES (2, 'tiangong', true, 100000, 3);
INSERT INTO public.space_station VALUES (3, 'skylab', false, 77088, 3);


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (1, 'AF Andromedae', 'Andromeda', 780000.00, 63.000, 90.0000, 33000, 'luminous blue variable', 2);
INSERT INTO public.star VALUES (2, 'Sun', NULL, NULL, 1.000, 1.0000, 5772, 'G-type main sequence (yellow dwarf)', 1);
INSERT INTO public.star VALUES (3, 'Proxima Centauri', 'Centaurus', 1.30, 0.154, 0.1221, 2992, 'M-type main sequence (red dwarf)', 1);
INSERT INTO public.star VALUES (4, 'Kepler-90', 'Draco', 855.00, 1.200, 1.2000, 6080, 'G-type main sequence (yellow dwarf)', 1);
INSERT INTO public.star VALUES (5, 'TRAPPIST-1', 'Aquarius', 12.47, 0.119, 0.0898, 2566, 'M-type main sequence (red dwarf)', 1);
INSERT INTO public.star VALUES (6, 'HD 219134', 'Cassiopeia', 6.54, 0.778, 0.8100, 4699, 'K-type main sequence (orange dwarf)', 1);


--
-- Name: galaxy_galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_galaxy_id_seq', 6, true);


--
-- Name: moon_moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_moon_id_seq', 21, true);


--
-- Name: planet_planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_planet_id_seq', 14, true);


--
-- Name: space_station_station_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.space_station_station_id_seq', 3, true);


--
-- Name: star_star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_star_id_seq', 6, true);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_name_key1; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key1 UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: space_station space_station_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.space_station
    ADD CONSTRAINT space_station_name_key UNIQUE (name);


--
-- Name: space_station space_station_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.space_station
    ADD CONSTRAINT space_station_pkey PRIMARY KEY (space_station_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: space_station space_station_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.space_station
    ADD CONSTRAINT space_station_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--

