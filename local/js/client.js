
// Client side manipulation
$(document).ready(()=>{
    var isVoteReady = false;
    var voter = null;
    // Rendering
    renderCandidates(initializeCandidates());

    var checkvoting = setInterval( 
        async()=>{
            let is_over = await enableVoting(isItVotingTime());
            if(is_over){
                clearInterval(checkvoting);
                console.log("Voting period is over...");
            }
        },
        20000
    );

    // Events

    // Vote candidate button
    $("#candidates").on("click", ".vote-btn", function(){
        let c_id = $(this).data("candidate");
        let c = $(this).parent().children(".vote-name").text();

        let conf = confirm(`Are you sure you want to vote ${c}?`)

        if(conf){
            sendVote(voter, c_id);
            voter = null;
            isVoteReady = false;
        }
    })

    // Check user
    $('#chk-user-btn').on('click',function(){

        if(!isVoteReady){
            let eid = $("#eid-txt").val();
            eid = eid.toLocaleLowerCase();
            renderVoter(eid).then((data)=>{
                isVoteReady = data;

                voter = isVoteReady ? eid : null;

                if(voter){
                    console.log(`${voter} is ready to vote...`);
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        }
    });

    $('#eid-txt').on('keypress', function (e) {
        if(!isVoteReady && e.keyCode == 13){
            let eid = $("#eid-txt").val();

            eid = eid.toLocaleLowerCase();

            renderVoter(eid).then((data)=>{
                isVoteReady = data;

                voter = isVoteReady ? eid : null;

                if(voter){
                    console.log(`${voter} is ready to vote...`);
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        }
  });

    // Clear user input
    $('#clr-user-btn').on('click',function(){

        clearRender();
        isVoteReady = false;
        voter = null;
    })
});


//  ======================  //
// | RENDERERS            | //
//  ======================  //

// Clears render
function clearRender(){

    $("#eid-txt").removeAttr("disabled");
    $("#chk-user-btn").removeAttr("disabled");
    $("#eid-txt").val("");
    $("#eid-form .error").addClass("hidden-log");
    $("#candidates").addClass("hidden-log")
}

// Renders any UI changes associated with eid input
function renderVoter(eid){
    return verifyEID(eid).then(function(data){

        if(data == "hasvoted"){
            alert("Employee ID has been used in voting.");
            $("#eid-form .error img").attr("title","Employee ID has been used in voting.");
            $("#eid-form .error").removeClass("hidden-log");
            $("#candidates").addClass("hidden-log")
            return false;
        }
        else if(data == "notregistered"){
            alert("Employee ID is not in list of registered voters.");
            $("#eid-form .error img").attr("title","Employee ID is not in list of registered voters.");
            $("#eid-form .error").removeClass("hidden-log");
            $("#candidates").addClass("hidden-log")
            return false;
        }
        else if(data){
            $("#eid-form .error").addClass("hidden-log");
            $("#eid-txt").val(getFullName(data));
            $("#eid-txt").attr("disabled","disabled");
            $("#chk-user-btn").attr("disabled","disabled");

            $("#candidates").removeClass("hidden-log")
            return true;
        }
        else{
            $("#eid-form .error").removeClass("hidden-log");
            $("#candidates").addClass("hidden-log")
            return false;
        }
    })
    .catch((err)=>{
        console.log(err);
        return false;
    })
}

// Renders all list of candidates to DOM
function renderCandidates(candidate){

    candidate.then((data)=>{
        $('#candidates').html(null);

        for(let i = 0 ; i<data.length; i++){

            $('#candidates').append(generateDivElemForCandidate(data[i]));
        }

        enableVoting(isItVotingTime());
    })
    .catch((err)=>{
        console.log(err);
    });

}

// Enables voting based on voting time result
function enableVoting(is_voting_time){

    return is_voting_time.then((data)=>{

        if(data == "early" || data == "over"){
            $('.vote-btn').addClass("disabled-btn");
        }
        else if(data == "yes"){
            $('.vote-btn').removeClass("disabled-btn");
        }
        
        if(data == "over"){
            return true;
        }
        return false;
    })
    .catch((err)=>{
        console.log(err);
    });

}

//  ======================  //
// | POST                 | //
//  ======================  //

// Send vote
function sendVote(voter, candidate_id){
    $.post(`/submit/vote`,{ eid:voter, c_id:candidate_id })
    .done(clearRender())
    .fail((err)=>{
        console.log(err);
    })
}

//  ======================  //
// | GET                  | //
//  ======================  //

// Check if eid is registered in the server
function verifyEID(eid){

    let user = new Promise(function(resolve, reject){
        $.get(`/get/isvoter?eid=${eid}`)
        .done(function(data){
            resolve(data);
        })
        .fail(function(err){
            reject(err);
        })
    })
    
    return user;
}



// Gets all the Candidates available in the web server
function initializeCandidates(){

    let candidates = new Promise(function(resolve, reject){
        $.get('/get/candidates')
        .done(function(data){
            resolve(data);
        })
        .fail(function(err){
            reject(err);
        });
    })

    return candidates;
}

// Gets all if voting time is true or false
function isItVotingTime(){

    let is_vote = new Promise(function(resolve, reject){
        $.get('/get/votingtime')
        .done(function(data){
            resolve(data);
        })
        .fail(function(err){
            reject(err);
        });
    })

    return is_vote;
}

//  ======================  //
// | HELPER               | //
//  ======================  //

function getFullName(row){
    let { f_name, m_name, l_name} = row;

    m_name = m_name[0];

    let fullname = `${l_name}, ${f_name} ${m_name}.`;

    return fullname;
}