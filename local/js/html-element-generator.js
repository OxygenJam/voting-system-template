//Candidates
function generateDivElemForCandidate(candidate){
    let { c_id } = candidate;

    let name = getFullName(candidate);

    return `
    <div class="vote-candidates" data-candidate="${c_id}">
        <div class="vote-img"><img src="local/imgs/${c_id}" class="candidate-pic"/></div>
        <div class="vote-name">${name}</div>
        <div class="vote-btn">Vote!</div>
    </div>
    `;
}