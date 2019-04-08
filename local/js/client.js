// Client side manipulation

$(document).ready(()=>{

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
        5000
    );

    // Events


    // Check user
    $('#chk-user-btn').on('click',function(){

        let eid = $("#eid-txt").val();

        renderVoter(eid);
    });

    // Clear user input
    $('#clr-user-btn').on('click',function(){

        $("#eid-txt").val("");
        $("#eid-form error").addClass("hidden-log");
    })
});


//  ======================  //
// | RENDERERS            | //
//  ======================  //

// Renders any UI changes associated with eid input
function renderVoter(eid){
    verifyEID(eid).then(function(data){

        if(data){
            $("#eid-form .error").addClass("hidden-log");
            $("#eid-txt").val(getFullName(data));
        }
        else{
            $("#eid-form .error").removeClass("hidden-log");
        }
    })
    .catch((err)=>{
        console.log(err);
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