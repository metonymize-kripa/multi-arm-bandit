/**
 * @file Game Log
 * @description This file contains the code for a simple game where two hunters try to catch a stag.
 * The game is played on a canvas element and keeps track of the score, time to catch, and distance between hunters.
 * The game loop updates the positions of the hunters and the stag, checks for catches, and handles game reset.
 * It also includes a function to download game metrics as a CSV file.
 * @module game_log
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let score1 = 0;
  let score2 = 0;

  // Initial positions
  let hunter1 = { x: 100, y: 100, color: 'red' };
  let hunter2 = { x: 700, y: 500, color: 'blue' };
  let lastPlayerMove = { dx: 0, dy: 0 }; // Tracks the last direction of player movement

// AI Strategy Module for Player1
const AIStrategy = {
    currentMode: 'No AI', // Default to No AI
  
    Random: function() {
      console.log('Executing Random AI Strategy for Player1');
      // Moves in a random direction at each decision point
      const directions = [-1, 0, 1];
      const dx = directions[Math.floor(Math.random() * 3)] * 20; // Change in x
      const dy = directions[Math.floor(Math.random() * 3)] * 20; // Change in y
      hunter1.x = Math.max(25, Math.min(hunter1.x + dx, canvas.width - 25));
      hunter1.y = Math.max(25, Math.min(hunter1.y + dy, canvas.height - 25));
    },
  
    Cooperative: function() {
        console.log('Executing Cooperative AI Strategy for Player1');
      // Moves towards Player 2 to assist in catching the stag
      //const angleToPlayer2 = Math.atan2(hunter2.y - hunter1.y, hunter2.x - hunter1.x);
      //hunter1.x += Math.cos(angleToPlayer2) * 1;// + Math.random() > 0.5 ? 30 : -30; // Add some randomness
      //hunter1.y += Math.sin(angleToPlayer2) * 1;// + Math.random() > 0.5 ? 30 : -30; // Add some randomness
      const angleToStag = Math.atan2(stag.y - hunter1.y, stag.x - hunter1.x); // moving towards stag, but more slowly, is a kind of cooperation
      hunter1.x += Math.cos(angleToStag) * 1;// + Math.random() > 0.5 ? 30 : -30; // Add some randomness
      hunter1.y += Math.sin(angleToStag) * 1;// + Math.random() > 0.5 ? 30 : -30; // Add some randomness
      hunter1.x = Math.max(25, Math.min(hunter1.x, canvas.width - 25));
      hunter1.y = Math.max(25, Math.min(hunter1.y, canvas.height - 25));
    },
  
    Competitive: function() {
        console.log('Executing Competitive AI Strategy for Player1');
      // Moves directly towards the stag, trying to catch it before Player2
      const angleToStag = Math.atan2(stag.y - hunter1.y, stag.x - hunter1.x);
      hunter1.x += Math.cos(angleToStag) * 2;
      hunter1.y += Math.sin(angleToStag) * 2;
      hunter1.x = Math.max(25, Math.min(hunter1.x, canvas.width - 25));
      hunter1.y = Math.max(25, Math.min(hunter1.y, canvas.height - 25));
    },
  
    execute: function() {
        if (this.currentMode !== 'No AI') {
          this[this.currentMode]();
        } else {
          // Apply last player move
          hunter1.x = Math.max(25, Math.min(hunter1.x + lastPlayerMove.dx, canvas.width - 25));
          hunter1.y = Math.max(25, Math.min(hunter1.y + lastPlayerMove.dy, canvas.height - 25));
        }
      }
};

document.getElementById('aiModeSelector').addEventListener('change', function(e) {
    AIStrategy.currentMode = e.target.value;
    console.log(`AI Mode changed to: ${e.target.value}`);
    document.getElementById('gameCanvas').focus();
  });

  let stag = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
  let startTime = Date.now(); // Start timing

  function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawSquare(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x - 15, y - 15, 30, 30); // Stag as a square
  }

  function moveStag() {
    // Determine closest hunter
    let dist1 = Math.hypot(hunter1.x - stag.x, hunter1.y - stag.y);
    let dist2 = Math.hypot(hunter2.x - stag.x, hunter2.y - stag.y);
    let closest = dist1 < dist2 ? hunter1 : hunter2;

    // Move stag away from the closest hunter
    let angle = Math.atan2(stag.y - closest.y, stag.x - closest.x);
    stag.x += Math.cos(angle) * 4; // Twice the speed of hunters
    stag.y += Math.sin(angle) * 4;
    stag.x += Math.random() > 0.5 ? 1 : -1;
    stag.y += Math.random() > 0.5 ? 1 : -1;

    // Keep within bounds
    stag.x = Math.max(25, Math.min(stag.x, canvas.width - 25));
    stag.y = Math.max(25, Math.min(stag.y, canvas.height - 25));

    // If stag hits a corner or wall make a random jump 
    // ten times the speed of the hunters
    if (stag.x === 25 || stag.x === canvas.width - 25 || stag.y === 25 || stag.y === canvas.height - 25) {
      stag.x += Math.random() > 0.5 ? 20 : -20; 
      stag.y += Math.random() > 0.5 ? 20 : -20;
    }
  }

  function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(hunter1.x, hunter1.y, hunter1.color);
    drawCircle(hunter2.x, hunter2.y, hunter2.color);
    drawSquare(stag.x, stag.y);

    // Execute AI strategy
    AIStrategy.execute();
    moveStag();

    // Check for catch
    if (Math.hypot(hunter1.x - stag.x, hunter1.y - stag.y) < 50) {
      score1++;
      document.getElementById('score1').innerText = score1;
      caughtStag();
      resetGame();
    } else if (Math.hypot(hunter2.x - stag.x, hunter2.y - stag.y) < 50) {
      score2++;
      document.getElementById('score2').innerText = score2;
      caughtStag();
      resetGame();
    }

    requestAnimationFrame(updateGame);
  }

  // Log a catch and update metrics
  function caughtStag() {
    // Calculate time to catch
    let endTime = Date.now();
    let timeToCatch = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds, keep two decimals
  
    // Calculate distance between hunters
    let distanceBetweenHunters = Math.hypot(hunter1.x - hunter2.x, hunter1.y - hunter2.y).toFixed(2);
  
    // Insert metrics into the table
    let tableRow = `<tr><td>${timeToCatch}</td><td>${distanceBetweenHunters}</td></tr>`;
    document.getElementById('gameMetrics').innerHTML += tableRow;
  }

  function resetGame() {
    hunter1 = { x: 100, y: 100, color: 'red' };
    hunter2 = { x: 700, y: 500, color: 'blue' };
    stag = { x: 400, y: 300 };
    startTime = Date.now(); // Start timing
  }

  // Player controls
  document.addEventListener('keydown', (event) => {
    let moveAmount = 20; // Adjust as necessary for game balance
    switch (event.key) {
        case 'a': if (hunter1.x - moveAmount > 25) hunter1.x -= moveAmount; break; // Left
        case 'd': if (hunter1.x + moveAmount < canvas.width - 25) hunter1.x += moveAmount; break; // Right
        case 'w': if (hunter1.y - moveAmount > 25) hunter1.y -= moveAmount; break; // Up
        case 's': if (hunter1.y + moveAmount < canvas.height - 25) hunter1.y += moveAmount; break; // Down
        case 'ArrowLeft': if (hunter2.x - moveAmount > 25) hunter2.x -= moveAmount; break;
        case 'ArrowRight': if (hunter2.x + moveAmount < canvas.width - 25) hunter2.x += moveAmount; break;
        case 'ArrowUp': if (hunter2.y - moveAmount > 25) hunter2.y -= moveAmount; break;
        case 'ArrowDown': if (hunter2.y + moveAmount < canvas.height - 25) hunter2.y += moveAmount; break;
    }

    // Add this script to handle CSV download
document.getElementById('downloadCsv').addEventListener('click', function() {
    const metrics = document.querySelectorAll('#gameMetrics tr');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Time to Catch (seconds),Distance Between Hunters (pixels)\r\n"; // Column headers
  
    metrics.forEach(function(row) {
      let rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(',');
      csvContent += rowData + "\r\n";
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'game_metrics.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  });
    
});

  updateGame(); // Start the game loop
});
