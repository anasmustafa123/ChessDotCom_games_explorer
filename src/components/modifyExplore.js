import { Chess } from "chess.js";

const totalPgn = (totalGames) => {
  const chess = new Chess();
  let pgnsAnResult = [];
  totalGames.forEach((game) => {
    if (game.pgn) {
      chess.load_pgn(game.pgn);
    }
    pgnsAnResult.push({
      result: game.result,
      moves: chess.history().toString().split(","),
    });
  });
  return pgnsAnResult;
};

const filterDate = () => {};

const getRatio = (currentGames, move, moveNum) => {
  let black = 0,
    draw = 0;
  let filtered = currentGames.filter((game) => {
    return game.moves[moveNum] == move;
  });
  filtered.forEach((game) => {
    if (game.result == "black") {
      black++;
    } else if (game.result == "draw") {
      draw++;
    }
  });
  return {
    white: Number(((filtered.length - black - draw) / filtered.length) * 100),
    black: Number(black / filtered.length) * 100,
    draw: Number(draw / filtered.length) * 100,
  };
};

const reduceOnMove = (games, move, moveNum, flag) => {
  let fullgames = [...games];
  if (games.length == 0) return { explorerArray: [], gamesAafterMove: [] };
  if (moveNum !== 0 && flag) {
    // remove the game that dont have the move
    fullgames = games.filter((game) => {
      if (!game.moves[moveNum - 1]) {
        return false;
      }
      return game.moves[moveNum - 1].toLowerCase() == move.toLowerCase();
    });
  }
  if (fullgames.length == 0) return { explorerArray: [], gamesAafterMove: [] };
  let count = 1;
  let explorerArray = [];
  // to make it easy to count similar moves
  let tempArr = fullgames.toSorted((a, b) => {
    if (!a.moves[moveNum]) {
      return 1;
    }
    if (!b.moves[moveNum]) {
      return -1;
    }
    return a.moves[moveNum].localeCompare(b.moves[moveNum]);
  });
  tempArr.forEach((value, index) => {
    // skip the first element
    if (
      index == 0 ||
      (value.moves.length <= moveNum &&
        tempArr[index - 1].moves.length <= moveNum)
    ) {
      return;
    }
    if (
      value.moves.length <= moveNum &&
      tempArr[index - 1].moves.length > moveNum
    ) {
      explorerArray.push({
        moveNum: moveNum + 1,
        move: tempArr[index - 1].moves[moveNum],
        n: count,
        ratio: getRatio(fullgames, tempArr[index - 1].moves[moveNum], moveNum),
      });
    } else {
      // if current value is like the previous value increment the count
      if (value.moves[moveNum] == tempArr[index - 1].moves[moveNum]) {
        count++;
      } else {
        // encounter new move
        explorerArray.push({
          moveNum: moveNum + 1,
          move: tempArr[index - 1].moves[moveNum],
          n: count,
          ratio: getRatio(
            fullgames,
            tempArr[index - 1].moves[moveNum],
            moveNum
          ),
        });
        count = 1;
      }
    }
  });
  if (tempArr[tempArr.length - 1].moves[moveNum] !== undefined) {
    explorerArray.push({
      moveNum: moveNum + 1,
      move: tempArr[tempArr.length - 1].moves[moveNum],
      n: count,
      ratio: getRatio(
        fullgames,
        tempArr[tempArr.length - 1].moves[moveNum],
        moveNum
      ),
    });
  }
  count = 1;

  explorerArray.sort((a, b) => {
    return b.n - a.n;
  });
  return { explorerArray: explorerArray, gamesAafterMove: fullgames };
};
export { totalPgn, reduceOnMove };
