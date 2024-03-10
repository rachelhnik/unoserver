import { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  avatar: string;
  userId: string;
}

export interface PlayerData {
  cards: {
    _id: any;
    color: string;
    cardNumber: number;
    cardName: string;
  }[];
  id: number;
  playerId: String;
  playerName: String;
  isPlayerTurn: boolean;
}

export interface IRoom {
  _id: ObjectId;
  name: string;
  password: string;
  socketId: string;
  ownerId: string;
  currentCard: Card;
  currentPlayerId: string;
  cards: Card[];
  players: PlayerData[];
  status: Status;
  clockwiseDirection: boolean;
  cardsToDraw: number;
}

export enum Status {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}
export interface Card {
  color: Color;
  cardNumber: number;
  cardName: string;
}

enum Color {
  BLUE = "BLUE",
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
}

export enum RoomEvent {
  NEWUSER = "new-user",
}

export enum GameEvent {
  START = "start",
  END = "end",
  WIN = "win",
  GAMEOVER = "gameover",
  UNO = "uno",
  DRAWCARD = "drawcard",
  DRAWTWO = "drawtwo",
  DRAWFOUR = "drawfour",
  CHANGECOLOR = "changecolor",
  REVERSE = "reverse",
  SKIP = "skip",
  NORMAL = "normal",
}
