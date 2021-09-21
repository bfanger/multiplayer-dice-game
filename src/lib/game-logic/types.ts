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
  connected: boolean;
};

export type Dice = {
  value: number;
  banked: boolean;
};
export type Chip = {
  value: number;
  playerId?: string;
  stackIndex?: number;
  disabled: boolean;
};
