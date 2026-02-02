export type Game = {
  id: string;
  turn?: string; // playerId
  phase: "NEW-TURN" | "THROWN" | "BANKED" | "GAME-OVER";
  players: Player[];
  dices: Dice[];
  chips: Chip[];
};

export type PlayerAvatar = {
  index: number;
  color: string;
};

export type Player = {
  id: string;
  name: string;
  avatar: PlayerAvatar;
  connected?: true;
};

export type Dice = {
  value: number;
  banked?: true;
};
export type Chip = {
  value: number;
  playerId?: string;
  stackIndex?: number;
  disabled?: true;
};
