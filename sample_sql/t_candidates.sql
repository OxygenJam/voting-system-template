-- Table: voting_singing_idol.t_candidates

-- DROP TABLE voting_singing_idol.t_candidates;

CREATE TABLE voting_singing_idol.t_candidates
(
  c_id serial NOT NULL,
  eid character varying,
  l_name character varying,
  f_name character varying,
  m_name character varying,
  CONSTRAINT t_candidates_pkey PRIMARY KEY (c_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE voting_singing_idol.t_candidates
  OWNER TO postgres;
