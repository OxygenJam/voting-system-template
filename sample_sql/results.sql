SELECT * FROM voting_singing_idol.t_votes

SELECT c_id, l_name, f_name, m_name, COUNT(vote_id) FROM voting_singing_idol.t_candidates
INNER JOIN voting_singing_idol.t_votes on voting_singing_idol.t_votes.vote_id = voting_singing_idol.t_candidates.c_id
GROUP BY c_id, l_name,f_name,m_name, vote_id ORDER BY COUNT(vote_id) DESC