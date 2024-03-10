import { uuid } from "uuidv4";

export const generateCards = () => {
  const numArr = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
  const actionArr = [22, 22, -1, -1, 101, 101];
  const wildArr = [4444, 4444, 4444, 4444, 1234, 1234, 1234, 1234];

  const blueCardsArr = numArr.map((num: number) =>
    makeNumberCard(num, "BLUE", "blue")
  );
  const redCardArr = numArr.map((num: number) =>
    makeNumberCard(num, "RED", "red")
  );
  const yellowCardArr = numArr.map((num: number) =>
    makeNumberCard(num, "YELLOW", "yellow")
  );
  const greenCardArr = numArr.map((num: number) =>
    makeNumberCard(num, "GREEN", "green")
  );

  const actionBlueArr = actionArr.map((actionNum) =>
    makeActionCard(actionNum, "BLUE", "blue")
  );
  const actionRedArr = actionArr.map((actionNum) =>
    makeActionCard(actionNum, "RED", "red")
  );
  const actionYellowArr = actionArr.map((actionNum) =>
    makeActionCard(actionNum, "YELLOW", "yellow")
  );
  const actionGreenArr = actionArr.map((actionNum) =>
    makeActionCard(actionNum, "GREEN", "green")
  );

  const wildCardArr = wildArr.map((wildNum) => makeWildCard(wildNum, "WILD"));

  const allCards = [
    ...blueCardsArr,
    ...actionBlueArr,
    ...redCardArr,
    ...actionRedArr,
    ...yellowCardArr,
    ...actionYellowArr,
    ...greenCardArr,
    ...actionGreenArr,
    ...wildCardArr,
  ];

  return allCards;
};

const makeNumberCard = (num: number, color: string, char: string) => {
  return {
    id: uuid(),
    color: color,
    cardNumber: num,
    cardName: `${char}_${num}.png`,
  };
};

//add 2 >> 22
// reverse >> -1
// skip>> 00
//
const makeActionCard = (num: number, color: string, char: string) => {
  return {
    color: color,
    cardNumber: num,
    cardName:
      num === 22
        ? `${char}_draw_2.png`
        : num === -1
        ? `${char}_reverse.png`
        : `${char}_skip.png`,
  };
};

const makeWildCard = (num: number, color: string) => {
  return {
    color: color,
    cardNumber: num,
    cardName: num === 4444 ? `any_draw_4.png` : `any_wild.png`,
  };
};

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
