# coordination-game
Minimally viable hunting game for two players and one target

- Player 1 controls: a:left, d:right, s:down, w:up
- Player 2: regular left, right, up and down arrows

Updates to the repo should be deployed within a minute to https://coordination-game.vercel.app/

## AI Strategies implemented

Here are brief summaries of the four strategies implemented in the AIStrategy object:
- No AI: This is the default mode. In this mode, the AI does not control Player1 (hunter1).
- Random: In this strategy, the AI moves Player1 (hunter1) in a random direction at each decision point. This is achieved by randomly selecting a direction from the set [-1, 0, 1] for both the x and y coordinates, which represents moving left/up, staying in place, or moving right/down respectively.
- Cooperative: In this strategy, the AI moves Player1 (hunter1) towards the stag, but at a slower pace. This is a form of cooperation as it allows Player2 (hunter2) to also move towards the stag. The direction towards the stag is calculated using the Math.atan2 function, and the position of hunter1 is updated accordingly.
- Competitive: In this strategy, the AI moves Player1 (hunter1) directly towards the stag, trying to catch it before Player2 (hunter2). This is similar to the Cooperative strategy, but the position of hunter1 is updated at twice the rate, matching the other player, making it more aggressive.