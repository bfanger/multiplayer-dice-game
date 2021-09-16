# Online Multiplayer Dice game

## Data structure

- Game[] (collection)
  - id
  - host (userid)
  - turn? (playerId)
  - state: BEGIN | THROWN | BANKED
  - Player[]
    - id
    - name
    - avatar
  - Dice[] (7)
    - roll (1-6)
    - banked (bool)
  - Chip[] (16)
    - value (number)
    - playerId?
    - stackIndex?
    - points (number)
    - disabled

## API

(All calls require auth)

### POST /api/games/host

returns new game id (`turn` is empty)

### GET /api/games/list

list of games without `turn` (id, host, nr players)

### POST /api/games/:id/join

game has `turn`? -> error
if not yet in the game -> adds player to the game

### POST /api/games/:id/start

game has `turn`? -> error
shuffles players and assign `turn` to the first player in the list
game state `BEGIN`

### POST /api/games/:id/throw

only allowed if playerId === turn
if game state is THROWN -> error
if game state BEGIN -> clear banked dices, and randomize values, set game state to THROWN
if game state BANKED -> randomize non banked dice, set game state to THROWN

if game state is THROWN && greedy -> set game state to BEGIN, set turn to next playerid

### POST /api/games/:id/bank

only allowed if playerId === turn
if game state is not THROWN -> error
assign dice of given type to banked and set state to BANKED

## /api/games/:id/steal

only allowed if playerId === turn
if game state is not BANKED -> error
if chip is not stealable -> error
add chip to top of the player stack, set turn to next player and state to BEGIN
