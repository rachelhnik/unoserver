import mongoose, { ClientSession } from "mongoose";
import Room from "../models/roomModel";
import {
  Card,
  GameEvent,
  IRoom,
  PlayerData,
  RoomEvent,
  Status,
} from "../types/interfaces";
import { checkDrawCards, checkNextIndex } from "../utils/cards";

interface RetrunProps {
  room: IRoom;
  players: PlayerData[];
  cardsArr: Card[];
  currentPlayer: PlayerData;
  nextIndex: number;
  nextPlayer: PlayerData;
}

const getRequiredData = async ({
  roomId,
  event,
  userId,
  isStart,
}: {
  roomId: string;
  event: string;
  userId: string;
  isStart: boolean;
}): Promise<RetrunProps> => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;
  const players = room?.players as PlayerData[];
  const cardsArr = [...room.cards];
  const currentPlayer = players?.find(
    (player) => player.playerId === userId
  ) as PlayerData;
  let nextIndex = checkNextIndex(event, players, currentPlayer, room, isStart);

  const nextPlayer = players.find(
    (player) => player.id === nextIndex
  ) as PlayerData;
  return { room, players, cardsArr, currentPlayer, nextIndex, nextPlayer };
};

export const handleGame = async ({
  roomId,
  cardId,
  userId,
  event,
  color,
}: {
  roomId: string;
  cardId: string;
  userId: string;
  event: string;
  color?: string;
}) => {
  const { room, players, cardsArr, currentPlayer, nextIndex, nextPlayer } =
    await getRequiredData({ roomId, event, userId, isStart: false });

  const currentCard = currentPlayer?.cards.find(
    (card) => card._id.toString() === cardId
  ) as Card;

  const hasCardInNextPlayer =
    currentCard?.cardNumber < 10 || currentCard?.cardNumber === 1234
      ? true
      : nextPlayer?.cards.find(
          (card) =>
            card.cardNumber === 4444 ||
            card.cardNumber === currentCard?.cardNumber
        );

  const cardsToDraw = checkDrawCards({
    currentCard: currentCard,
    cardsToDraw: room.cardsToDraw,
  });

  const newCardsArr = hasCardInNextPlayer
    ? []
    : cardsArr.splice(0, cardsToDraw);

  const finalNextIndex = hasCardInNextPlayer
    ? nextIndex
    : checkNextIndex(GameEvent.SKIP, players, currentPlayer, room, false);

  let mark = 0;

  const newPlayersArr = players?.map((player) => {
    if (player.playerId === userId) {
      mark += Number(player?.mark) + Number(currentCard.mark);

      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards.filter((card) => card._id.toString() !== cardId),
        isPlayerTurn: player.id === finalNextIndex ? true : false,
        mark: mark,
      };
    } else {
      const cards = [...(player?.cards || [])] as Card[];
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards:
          player.id === nextPlayer?.id
            ? [...cards, ...newCardsArr]
            : player.cards,
        isPlayerTurn: player.id === finalNextIndex ? true : false,
        mark: player.mark,
      };
    }
  });
  if (newPlayersArr) {
    await Room.findByIdAndUpdate(
      { _id: roomId },
      {
        players: newPlayersArr,
        currentCard: color
          ? {
              cardName: currentCard.cardName,
              cardNumber: currentCard.cardNumber,
              color: color,
            }
          : currentCard,
        cards: cardsArr,
        currentPlayerId: nextPlayer?.playerId,
        cardsToDraw: hasCardInNextPlayer ? cardsToDraw : 0,

        clockwiseDirection:
          event === GameEvent.REVERSE
            ? !room?.clockwiseDirection
            : room?.clockwiseDirection,
      },
      { new: true }
    );
    return mark;
  }
};

export const handleCardDraw = async ({
  roomId,
  userId,
  droppableId,
  uno,
}: {
  roomId: string;
  userId: string;
  droppableId: string;
  uno: boolean;
}) => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;
  const players = room?.players as PlayerData[];
  const cardsArr = [...room.cards];
  const drawCard = uno ? cardsArr.splice(0, 2) : cardsArr.splice(0, 1);

  const currentPlayer = players?.find(
    (player) => player.playerId === userId
  ) as PlayerData;

  let nextIndex = checkNextIndex(
    GameEvent.DRAWCARD,
    players,
    currentPlayer,
    room,
    false
  );

  const nextPlayer = players.find((player) => player.id === nextIndex);

  const isCardUsable = uno
    ? false
    : drawCard[0].color === room.currentCard.color ||
      drawCard[0].cardNumber === room.currentCard.cardNumber ||
      drawCard[0].cardNumber === 1234 ||
      drawCard[0].cardNumber === 4444;

  const newPlayersArr = players?.map((player) => {
    const cards = [...player?.cards, ...drawCard] as Card[];
    // console.log("cards", cards.length);

    if (player.playerId === userId) {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: cards,
        isPlayerTurn: isCardUsable ? true : false,
        mark: player.mark,
      };
    } else {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards,
        isPlayerTurn: isCardUsable
          ? false
          : player.id === nextPlayer?.id
          ? true
          : false,
        mark: player.mark,
      };
    }
  });
  if (newPlayersArr) {
    await Room.findByIdAndUpdate(
      { _id: roomId },
      {
        players: newPlayersArr,
        cards: cardsArr,
        currentCard: room.currentCard,
        currentPlayerId: nextPlayer?.playerId,
        cardsToDraw: room.cardsToDraw,
        direction: room.clockwiseDirection,
      },
      { new: true }
    );
  }
  return isCardUsable;
};

export const handleEndGame = async ({
  roomId,
  cardId,
  userId,
  droppableId,
}: {
  roomId: string;
  cardId: string;
  userId: string;
  droppableId: string;
}) => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;

  const players = room?.players as PlayerData[];

  const finalPlayersArr = players?.map((player) => {
    if (player.playerId === userId) {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: [],
        isPlayerTurn: true,
      };
    } else {
      return player;
    }
  });
  if (finalPlayersArr) {
    await Room.findByIdAndUpdate(
      { _id: roomId },
      {
        players: finalPlayersArr,
        cards: room.cards,
        currentCard: room.currentCard,
        currentPlayerId: room.currentPlayerId,
        cardsToDraw: 0,
        status: Status.ENDED,
        direction: room.clockwiseDirection,
      },
      { new: true }
    );
  }
};
