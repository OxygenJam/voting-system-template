-- Table: voting_singing_idol.t_votes

-- DROP TABLE voting_singing_idol.t_votes;

CREATE TABLE voting_singing_idol.t_votes
(
  eid character varying,
  vote_id integer,
  CONSTRAINT t_votes_vote_id_fkey FOREIGN KEY (vote_id)
      REFERENCES voting_singing_idol.t_candidates (c_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE voting_singing_idol.t_votes
  OWNER TO postgres;
