let rewards = [Math.random(), Math.random(), Math.random()];
const armNames = ['A', 'B', 'C'];
const maxTries = 20;
let tries = 0;
let round = 1;
let changesLog = [];
let epsilon = 0.1;  // Probability of exploration in epsilon-greedy strategy
let strategy = "epsilon-greedy";  // Can be "epsilon-greedy" or "random"
let estimatedRewards = [0, 0, 0];  // Initial estimated rewards for epsilon-greedy
let chosenCounts = [0, 0, 0];  // Counts of choices for each arm

function initializeRewards() {
    rewards = [Math.random(), Math.random(), Math.random()];
    // Log initial rewards as change 0
    changesLog.push({
        change: 0,
        rewards: [...rewards]  // Copy the rewards array to prevent mutation
    });
    let changeTime = Math.floor(Math.random() * 16) + 5;  // Between 5 and 20
    return changeTime;
}

let nextChange = initializeRewards();

function simulatedPlayer() {
    if (true) {//(strategy === "random" || Math.random() < epsilon) {
        return Math.floor(Math.random() * 3);  // Explore: choose randomly
    } else {
        return estimatedRewards.indexOf(Math.max(...estimatedRewards));  // Exploit: choose the best estimated arm
    }
}

function updateEstimations(armIndex, reward) {
    chosenCounts[armIndex]++;
    estimatedRewards[armIndex] += (reward - estimatedRewards[armIndex]) / chosenCounts[armIndex];
}

function playGame(selectedArm) {
    if (tries === 0) {
        setupTableForNewRound();
    }
    if (tries < maxTries) {
        if (tries === nextChange) {
            nextChange += initializeRewards();  // Schedule next change
            changesLog.push({ round: round, try: tries + 1, newRewards: [...rewards.map(r => r.toFixed(2))] });
        }
        const index = armNames.indexOf(selectedArm);
        const reward = parseFloat(rewards[index].toFixed(2));
        const simIndex = simulatedPlayer();
        const simReward = parseFloat(rewards[simIndex].toFixed(2));
        updateEstimations(simIndex, simReward);
        updateTableForTry(selectedArm, reward, armNames[simIndex], simReward);
        tries++;
        if (tries === maxTries) {
            displayChanges();
            round++;
            tries = 0;
            changesLog = [];
            nextChange = initializeRewards();
            estimatedRewards = [0, 0, 0];
            chosenCounts = [0, 0, 0];
        }
    }
}

function setupTableForNewRound() {
    const headerRow = document.getElementById('headerRow');
    headerRow.innerHTML = '<th>Round</th>';  // Reset header
    for (let i = 1; i <= maxTries; i++) {
        const th = document.createElement('th');
        th.textContent = `Try ${i}`;
        headerRow.appendChild(th);
    }
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    newRow.setAttribute('id', 'round' + round);
    const roundCell = newRow.insertCell(0);
    roundCell.innerHTML = round;
}

function updateTableForTry(userChoice, userScore, simChoice, simScore) {
    const newRow = document.getElementById('round' + round);
    const newCell = newRow.insertCell(newRow.cells.length);
    newCell.innerHTML = `User: ${userChoice}: ${userScore.toFixed(2)}, Sim: ${simChoice}: ${simScore.toFixed(2)}`;
}

function displayChanges() {
    const changesText = changesLog.map(c => `Change at try ${c.try}: ${c.newRewards.join(', ')}`).join('; ');
    document.getElementById('result').innerHTML = `Round ${round} complete. Reward changes: ${changesText}`;
}

function downloadCSV() {
    const rows = document.querySelectorAll("table tr");
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(row) {
        let rowData = row.querySelectorAll("td,th");
        rowData.forEach((cell, index) => {
            csvContent += '"' + cell.textContent.replace(/"/g, '""') + '"' + (index < rowData.length - 1 ? "," : "");
        });
        csvContent += "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bandit_results.csv");
    document.body.appendChild(link);  // Required for FF
    link.click();
    document.body.removeChild(link);
}
