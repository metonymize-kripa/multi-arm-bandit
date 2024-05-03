# Restless Multi-Armed Bandit Game

## Overview
This web application simulates a "Restless Multi-Armed Bandit" game where the probabilities of winning change at random intervals. Players can interact with one of three arms (A, B, or C) to test their luck and strategy under varying conditions. The game includes a simulation of another player using an epsilon-greedy algorithm or a random strategy to provide additional dynamics and learning opportunities.

## Features
- **Dynamic Reward Probabilities:** The reward probabilities for each arm change at random intervals between 5 and 20 tries.
- **Simulated Player:** Accompanying the user's interactions, a simulated player operates under a specified strategy, either epsilon-greedy or random.
- **Results Table:** All tries and outcomes are logged in a dynamic table showing both the user's and the simulated player's choices and scores.
- **CSV Export:** The results can be downloaded as a CSV file for further analysis or record-keeping.

## How to Use
1. **Select an Arm:** Click one of the buttons ('Arm A', 'Arm B', or 'Arm C') to make a choice based on the arm you want to test.
2. **View Results:** After each selection, the outcomes for both you and the simulated player are displayed in the results table.
3. **End of Round:** Once the maximum number of tries (20) is reached, the round ends, and the true reward probabilities are displayed. The game then resets for another round.
4. **Download Results:** Click the 'Download CSV' button to save the results of your game sessions.

## Strategy
- **Epsilon-Greedy:** With a small probability (epsilon = 0.1), the simulated player explores by choosing an arm at random; otherwise, it exploits by choosing the arm with the highest estimated reward based on past outcomes.
- **Random:** The simulated player chooses completely at random, disregarding past outcomes.

## Technical Details
- **HTML/CSS/JavaScript:** Utilizes Bootstrap for styling and basic HTML and JavaScript for functionality.
- **Script Dependencies:** 
  - `script_v4.js` contains the game logic and event handlers.
  - Bootstrap and jQuery from CDN for UI components and interactions.

## Future Enhancements
- Implement adaptive strategies for the user.
- Provide statistical analysis tools within the application for detailed performance tracking.

For more information on setup and configurations, refer to the inline comments in the code which explain the operational details and functions used.

