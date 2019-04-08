-- Table: voting_singing_idol.t_voters

-- DROP TABLE voting_singing_idol.t_voters;

CREATE TABLE voting_singing_idol.t_voters
(
  eid character varying,
  l_name character varying,
  f_name character varying,
  m_name character varying
)
WITH (
  OIDS=FALSE
);
ALTER TABLE voting_singing_idol.t_voters
  OWNER TO postgres;
