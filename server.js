// Retrieve from DB list of candidates and their IDs

// Send server time to clients to enable / disable voting functionality

// Send server the tallies

// Use Sockets

/**
 * Author: Zird Triztan Driz
 * Purpose: Generic Simple Voting System
 * Description:
 *  -- A simple generic voting system to be used, where connection to 
 *  the backend DB server can be modified here. This shall be used in conjunction
 *  with the boilerplate / template HTML I have created alongside this application.
 * 
 *  This can be hosted if you wish so, just modify this code appropriately, and make
 *  sure you know what you're doing; if not, research about hosting and deploying a 
 *  NodeJS application to a webserver.
 * 
 *  For now this will be hosted locally; why you may ask? Because I have limited timespan
 *  to do this sudden application.
 * 
 *  RDBMS seems more suitable for this than NoSQL, I may be wrong, but I choose to use
 *  Postgre SQL than my usual MongoDB
 */

 const express = require('express');
 const app = express();
 const pp = require('./prettyPrint.js');
 const db = require('./voting-db-manager.js')
 const bodyParser = require('body-parser');
 // const socket = require('socket.io')(app);

 // In case you forget when modifying this, months are index-based
 const voting_timespan = {
    start:new Date(2019,3,5,17,0,0),
    end:new Date(2019,11,5,17,25,0)
 }

// ================ //
// | Middleware   | //
// ================ //

app.use('/local', express.static('local'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


// ================ //
// | POST          |//
// ================ //

// Submit vote
app.post('/submit/vote',(req,res)=>{
    let eid = req.body.eid;
    let c_id = req.body.c_id;

    vote = db.submitVote(eid,c_id);

    vote.then((data)=>{
        pp.logPrint(data);

    })
    .catch((err)=>{
        pp.errPrint(err);
    })
})


// ================ //
// | GET          | //
// ================ //

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/voting_site.html`);
});

app.get('/tally',(req,res)=>{
    res.sendFile(`${__dirname}/tally_site.html`);
});


// Modify this 

// CANDIDATES LIST
app.get('/get/candidates',(req,res)=>{
    let candidates = [];

    pp.logPrint("Retrieving candidates from DB...");

    candidates = db.getCandidates();

    candidates.then((data)=>{

        //console.log(data);
        pp.logPrint("Sending candidates...");
        res.send(data);
    })
    .catch((err)=>{
        pp.errPrint(err);
    })
    
});


// VOTERS LIST
app.get('/get/isvoter', async (req,res)=>{
    let user = req.query.eid;

    pp.logPrint(`Checking if eid "${user}" is in the list of registered voters from DB...`);

    let isVoter = db.isRegristeredVoter(user);

    let isRegistered = false, hasVoted = true ;

    let tosend = null;

    let voter = await isVoter.then((data)=>{

        // console.log(data);
        data = data ? data[0]: null

        isRegistered  = data ? true : false
        pp.logPrint(`${user} is voter? ${isRegistered}`);

        return data;
    })
    .catch((err)=>{
        pp.errPrint(err);
        res.end(err);
    })

    if(!isRegistered){

        tosend = "notregistered";
    }
    else{

        await db.hasAlreadyVoted(user).then((data)=>{

            // console.log(data);
    
            data = data.length > 0 ? true : false
            pp.logPrint(`${user} has voted? ${data}`);
    
            if(!data){
                hasVoted = false;
            }
            
        })
        .catch((err)=>{
            pp.errPrint(err);
            res.end(err);
        })
    
        if(hasVoted){
            tosend = "hasvoted";
        }
    }

    if(isRegistered && !hasVoted){
        pp.logPrint(`Sending information of eid ${user}`);
        tosend = voter;
    }

    res.send(tosend);

})

// VOTE COUNT
app.get('/get/results/', (req,res)=>{
    let votes = [];

    let current_date = new Date();
    let { end } = voting_timespan;

    if(current_date >= end){
        pp.logPrint("Retrieving uncovered results from DB...");

        votes = db.getVoteCount();

        votes.then((data)=>{
            
            // console.log(data);

            pp.logPrint("Sending results...");
            res.send(data);
        })
        .catch((err)=>{
            pp.errPrint(err);
        })
    }
    else{
        pp.logPrint("It is not yet time to reveal the candidates...")

        votes = db.getVoteCount();

        votes.then((data)=>{

            // console.log(data);

            pp.logPrint("Clouding results...");
            for(var i = 0; i<data.length;i++){
                let dummy = {
                    c_id:-1,
                    l_name:"????",
                    f_name:"????",
                    m_name:"????",
                    votes:data[i].votes
                }

                data[i] = dummy;
            }

            pp.logPrint("Sending results...");
            res.send(data);

        })
        .catch((err)=>{
            pp.errPrint(err);
        })
    }
    
})

app.get('/get/votingtime', (req,res)=>{

    pp.logPrint("Checking if voting time...");
    let current_date = new Date(); 
    let {start , end}  = voting_timespan;
    
    if(current_date < start){
        
        pp.errPrint("Voting time is too early.");
        res.send("early");
    }
    else if(current_date >= start){
        
        if(current_date > end){

            pp.errPrint("Voting time is over.");
            res.send("over");
        }
        else{
            pp.logPrint("Voting is ongoing...")
            res.send("yes");
        }
    }
})



// ================ //
// | LISTEN       | //
// ================ //
app.listen(3000,()=>{
    pp.logPrint("Server is now up and running!");
});