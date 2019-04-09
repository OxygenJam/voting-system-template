$(document).ready(()=>{


    renderVoteData();

    let checkResults = setInterval(renderVoteData(),60000);
});


//  ======================  //
// | Renderer             | //
//  ======================  //

function renderVoteData(){

    getVoteData().then((data)=>{
        $("#tally-candidates").html(null);

        let total_votes = data.reduce((sum, d)=>{ return sum + parseInt(d.votes);}, 0);

        for(let i= 0; i<data.length; i++){

            $("#tally-candidates").append(generateDivElemForResults(data[i], total_votes));
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}
//  ======================  //
// | GET                  | //
//  ======================  //

// Get vote results
function getVoteData(){

    let data = new Promise((resolve,reject)=>{

        $.get('/get/results').done(function(data){
            
            resolve(data);
        })
        .fail(function(err){
            reject(err);
        })
    });

    return data;
}