//Candidates
function generateDivElemForCandidate(candidate){
    let { c_id } = candidate;

    let name = getFullName(candidate);

    return `
    <div class="vote-candidates" data-candidate="${c_id}">
        <div class="vote-img"><img src="local/imgs/candidates/${c_id}.jpg" class="candidate-pic"/></div>
        <div class="vote-name">${name}</div>
        <div class="vote-btn">Vote!</div>
    </div>
    `;
}