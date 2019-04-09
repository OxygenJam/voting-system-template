require('dotenv').config();

const { Pool } = require('pg');

var exports = module.exports = {};

const schema = process.env.PGSCHEMA;

exports.getCandidates = function(){

    let pool = new Pool();

    // console.log(process.env.PGUSER);
    return pool.connect()
        .then((client) =>{
            return client.query(`SELECT * FROM ${schema}.t_candidates`)
                .then((res) =>{
                    client.release();
                    return res.rows;
                })
                .catch((err) =>{
                    client.release();
                    throw(err);
                });
        })
        .catch((err)=>{
            throw(err);
        });
}

exports.isRegristeredVoter = function(user){

    let pool = new Pool();

    return pool.connect()
        .then((client) =>{
            return client.query(`SELECT * FROM ${schema}.t_voters where eid= $1`, [user])
                .then((res) =>{
                    client.release();
                    return res.rows;
                })
                .catch((err) =>{
                    client.release();
                    throw(err);
                });
        })
        .catch((err)=>{
            throw(err);
        });
}

exports.getVoteCount = function(){

    let pool = new Pool();

    return pool.connect()
        .then((client) =>{
            return client.query(`SELECT c_id, l_name, f_name, m_name, COUNT(vote_id) as votes FROM ${schema}.t_candidates
                LEFT JOIN ${schema}.t_votes on ${schema}.t_votes.vote_id = ${schema}.t_candidates.c_id
                GROUP BY c_id, l_name,f_name,m_name, vote_id ORDER BY COUNT(vote_id) DESC`)
                .then((res) =>{
                    client.release();
                    return res.rows;
                })
                .catch((err) =>{
                    client.release();
                    throw(err);
                });
        })
        .catch((err)=>{
            throw(err);
        });
}
