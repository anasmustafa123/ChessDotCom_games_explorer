import { Chess } from "chess.js";
const reducePgn = (totalGames) => {
  const chess = new Chess();
  let pgnsAnResult = [];
  totalGames.forEach((game, index) => {
    if (game.pgn) {
      chess.load_pgn(game.pgn);
    }
    pgnsAnResult.push({
      index: index,
      result: game.result,
      moves: chess.history().toString().split(","),
    });
  });
  return pgnsAnResult;
};

const reduceMultiple = (games, move, moveNum, movesSeq) => {
  return games.filter((game) => {
    for (let i = 0; i < movesSeq.length; i++) {
      if (game.moves[i] != movesSeq[i]) {
        return false;
      }
    }
    return true;
  });
};

const reduceSingle = (games, move, moveNum) => {
  return games.filter((game) => {
    if (!game.moves[moveNum - 1]) {
      return false;
    }
    return game.moves[moveNum - 1].toLowerCase() == move.toLowerCase();
  });
};

const reduceUndo = (games, move, moveNum, movesSeq) => {
  let count = 0;
  return games.filter((game, index) => {
    count = 0;
    for (let i = 0; i < moveNum; i++) {
      if (game.moves[i] == movesSeq[i]) {
        count++;
      }
    }
    return count == moveNum;
  });
};

const reduceOnColorChange = (games, newcolor, totalGames) => {
  return games.filter((game) => {
    return totalGames[game.index].color.toLowerCase() == newcolor;
  });
};
/**
 *
 * @param {Array} games
 * @param {String} move
 * @param {Number} moveNum
 * @param {Function} callback callback used to filter the games and is called first
 * @returns { explorerArray, gamesAafterMove }
 * {gamesAfterMove} are the games array after filtering using the callback function
 * {explorerArray} are the top used lines
 */
const reduceOnMove = (games, move, moveNum, movesSeq, callback) => {
  let fullgames = callback(games, move, moveNum, movesSeq);
  if (games.length == 0) return { explorerArray: [], gamesAafterMove: [] };
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
        tempArr[index - 1].moves.length <= moveNum) ||
      value.moves[0] == ""
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
  if (
    tempArr[tempArr.length - 1].moves[moveNum] !== undefined &&
    tempArr[tempArr.length - 1].moves[0] !== ""
  ) {
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
  console.log({ explorerArray });
  return { explorerArray: explorerArray, gamesAafterMove: fullgames };
};

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

export {
  reduceMultiple,
  reduceSingle,
  reduceUndo,
  reduceOnColorChange,
  reduceOnMove,
  reducePgn,
};
