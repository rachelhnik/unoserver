import mongoose, { ClientSession } from "mongoose";
import Room from "../models/roomModel";
import {
  Card,
  GameEvent,
  IRoom,
  PlayerData,
  RoomEvent,
} from "../types/interfaces";

export const handleStartGame = async ({
  roomId,
  cardId,
  userId,
  event,
}: {
  roomId: string;
  cardId: string;
  userId: string;
  event: string;
}) => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;
  const players = room?.players as PlayerData[];
  const currentPlayer = players?.find(
    (player) => player.playerId === userId
  ) as PlayerData;
  let nextIndex = checkNextIndex(event, players, currentPlayer, room);
  console.log("next", nextIndex);
  const nextPlayer = players.find((player) => player.id === nextIndex);
  console.log("next", nextPlayer);
  const cardsToDraw = checkDrawCards({
    currentCard: room.currentCard,
    cardsToDraw: room.cardsToDraw,
  });

  const newCardsArr =
    event === GameEvent.DRAWFOUR
      ? room.cards.splice(0, 4)
      : event === GameEvent.DRAWTWO
      ? room.cards.splice(0, 2)
      : [];

  const newPlayersArr = players?.map((player) => {
    if (player.playerId === userId) {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: [...player.cards, ...newCardsArr],
        isPlayerTurn: false,
      };
    } else {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards,
        isPlayerTurn: player.id === nextPlayer?.id ? true : false,
      };
    }
  });

  if (newPlayersArr) {
    const data = await Room.findByIdAndUpdate(
      { _id: roomId },
      {
        players: newPlayersArr,
        currentCard: room.currentCard,
        currentPlayerId: nextPlayer?.playerId,
        cardsToDraw: cardsToDraw,
        direction:
          event === GameEvent.REVERSE
            ? !room?.clockwiseDirection
            : room?.clockwiseDirection,
      },
      { new: true }
    );
    console.log("room", data?.players[0].cards);
  }
};

export const handleGame = async ({
  roomId,
  cardId,
  userId,
  event,
}: {
  roomId: string;
  cardId: string;
  userId: string;
  event: string;
}) => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;
  const players = room?.players as PlayerData[];

  const currentPlayer = players?.find(
    (player) => player.playerId === userId
  ) as PlayerData;

  const currentCard = currentPlayer?.cards.find(
    (card) => card._id.toString() === cardId
  ) as Card;

  let nextIndex = checkNextIndex(event, players, currentPlayer, room);
  console.log("next", nextIndex);
  const nextPlayer = players.find((player) => player.id === nextIndex);
  console.log("next", nextPlayer);

  const cardsToDraw = checkDrawCards({
    currentCard,
    cardsToDraw: room.cardsToDraw,
  });

  const newPlayersArr = players?.map((player) => {
    if (player.playerId === userId) {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards.filter((card) => card._id.toString() !== cardId),
        isPlayerTurn: player.id === nextPlayer?.id ? true : false,
      };
    } else {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards,
        isPlayerTurn: player.id === nextPlayer?.id ? true : false,
      };
    }
  });

  if (newPlayersArr) {
    const data = await Room.findByIdAndUpdate(
      { _id: roomId },
      {
        players: newPlayersArr,
        currentCard: currentCard,
        currentPlayerId: nextPlayer?.playerId,
        cardsToDraw: cardsToDraw,
        direction:
          event === GameEvent.REVERSE
            ? !room?.clockwiseDirection
            : room?.clockwiseDirection,
      },
      { new: true }
    );
    console.log("room", data?.players[0].cards);
  }
};

export const handleCardDraw = async ({
  roomId,
  userId,
  droppableId,
}: {
  roomId: string;
  userId: string;
  droppableId: string;
}) => {
  const room = (await Room.findById({ _id: roomId })) as IRoom;
  const players = room?.players as PlayerData[];
  const cardsArr = [...room.cards];
  const drawCard = cardsArr.shift() as Card;

  const currentPlayer = players?.find(
    (player) => player.playerId === userId
  ) as PlayerData;

  let nextIndex = checkNextIndex(
    GameEvent.DRAWCARD,
    players,
    currentPlayer,
    room
  );

  const nextPlayer = players.find((player) => player.id === nextIndex);

  const newPlayersArr = players?.map((player) => {
    const cards = [...(player?.cards || [])] as Card[];
    cards.push(drawCard);

    console.log("cards", cards);

    if (player.playerId === userId) {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: cards,
        isPlayerTurn: false,
      };
    } else {
      return {
        id: player.id,
        playerId: player.playerId,
        playerName: player.playerName,
        cards: player.cards,
        isPlayerTurn: player.id === nextPlayer?.id ? true : false,
      };
    }
  });
  if (newPlayersArr) {
    const data = await Room.findByIdAndUpdate(
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
    console.log("room", data?.players[0].cards);
  }
};

const checkNextIndex = (
  event: string,
  players: PlayerData[],
  currentPlayer: PlayerData,
  room: IRoom
) => {
  if (event === GameEvent.SKIP) {
    const skipDirection = room.clockwiseDirection ? 1 : -1;
    const nextIndex =
      (currentPlayer.id + 2 * skipDirection + players.length) % players.length;
    return nextIndex;
  }

  if (event === GameEvent.REVERSE) {
    const reverseDirection = room?.clockwiseDirection ? -1 : 1;
    const nextIndex =
      (currentPlayer.id + reverseDirection + players.length) % players.length;
    return nextIndex;
  }

  const direction = room?.clockwiseDirection ? 1 : -1;
  const nextIndex =
    (currentPlayer.id + direction + players.length) % players.length;
  return nextIndex;
};

const checkDrawCards = ({
  currentCard,
  cardsToDraw,
}: {
  currentCard: Card;
  cardsToDraw: number;
}) => {
  return currentCard.cardNumber === 22
    ? cardsToDraw + 2
    : currentCard.cardNumber === 4444
    ? cardsToDraw + 4
    : cardsToDraw;
};
