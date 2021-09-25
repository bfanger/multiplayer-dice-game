export type Game = {
  id: string;
  hostPlayerId: string;
  turn?: string; // playerId
  phase: "BEGIN" | "THROWN" | "BANKED";
  players: Player[];
  dices: Dice[];
  chips: Chip[];
};
export type Player = {
  id: string;
  name: string;
  avatar: string;
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
