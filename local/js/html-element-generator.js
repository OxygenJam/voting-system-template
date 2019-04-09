//Candidates
function generateDivElemForCandidate(candidate){
    let { c_id } = candidate;

    let name = getFullName(candidate);

    return `
<<<<<<< HEAD
    <div class="vote-candidates">
=======
    <div class="vote-candidates" data-candidate="${c_id}">
>>>>>>> 09d753a066ef20fa6d179a61b0d07a0100d775f4
        <div class="vote-img"><img src="local/imgs/candidates/${c_id}.jpg" class="candidate-pic"/></div>
        <div class="vote-name">${name}</div>
        <div class="vote-btn" data-candidate="${c_id}">Vote!</div>
    </div>
    `;
}

//Tally Candidates
function generateDivElemForResults(candidate, total_votes){
    let { c_id, votes } = candidate;

    c_id = c_id == -1 ? "unknown" : c_id;

    console.log(total_votes);

    let name = getFullName(candidate);

    let width = Math.floor((votes/total_votes)*100);

    return `
    <div class="vote-tally-candidates">
        <div class="vote-img"><img src="local/imgs/candidates/${c_id}.jpg" class="candidate-pic"/></div>
        <div class="vote-candidates-detail">
            <div class="vote-candidates-name">
                ${name}
            </div>
            <div class="vote-meter" style="width:${width}%">${votes} Votes</div>
        </div>   
    </div>
    `;
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