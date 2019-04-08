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
            return client.query(`SELECT vote_id, COUNT(vote_id) FROM ${schema}.t_votes GROUP BY vote_id ORDER BY COUNT(vote_id) DESC`)
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
