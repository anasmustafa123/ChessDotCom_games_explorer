import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
async function fetchPlayerProfileInfo(username) {
  const url = `https://api.chess.com/pub/player/${username}`;

  const response = await fetch(url);
  if (!response.ok) {
    toast.error("Error Enter correct chess.com username.");
    throw new Error(`Error getting profile info: ${response.status}`);
  }
  toast.success("correct username wait for game loading....");
  const data = await response.json();
  return data;
}

async function getPlayerProfileInfo(username) {
  let info = await fetchPlayerProfileInfo(username);
  let joinYearMonth = getYearAndMonth(info["joined"]);
  return {
    joinMonth: joinYearMonth.month,
    joinYear: joinYearMonth.year,
    username: username,
    url: info["url"],
  };
}

async function fetchChessGamesonMonth(username, year, month) {
  let month_str = month < 10 ? "0" + String(month) : month;
  const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month_str}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      toast.error("Error Enter correct chess.com username..");
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error("Error Enter correct chess.com username...");
    return null; // Or handle the error differently
  }
}

const minimizeData = (username, monthGames) => {
  let minimizedData = [];
  let sample = {
    result: "",
    color: "",
    pgn: "",
    opponentRating: 0,
    time_class: "",
  };
  monthGames.forEach((game) => {
    sample = {
      result: "",
      color: "",
      pgn: "",
      opponentRating: 0,
      time_class: "",
    };
    if (game.black.result === "win") {
      sample.result = "black";
    } else if (
      game.black.result === "agreed" ||
      game.black.result === "repetition" ||
      game.black.result === "stalemate" ||
      game.black.result === "timevsinsufficient" ||
      game.black.result === "insufficient"
    ) {
      sample.result = "draw";
    } else {
      sample.result = "white";
    }
    if (game.black.username === username) {
      sample.color = "black";
      sample.opponentRating = game.white.rating;
    } else {
      sample.color = "white";
      sample.opponentRating = game.black.rating;
    }
    sample.time_class = game.time_class;
    sample.pgn = game.pgn;

    minimizedData.push(sample);
  });
  return minimizedData;
};

/**
 * @param {String} username
 * @param {Number} smonth
 * @param {Number} syear
 * @param {Number} emonth
 * @param {Number} eyear
 * @param {callback} callback1 (require no params) will be called each month
 * @param {callback} callback2 (takes games loaded in this month) will be called each month
 * @returns {Array} allGames
 */
async function getAllPlayerGames(
  username,
  smonth,
  syear,
  emonth,
  eyear,
  callback1,
  callback2
) {
  let allGames = [];
  for (let startYear = syear; startYear <= eyear; startYear++) {
    // if current year last month is the current month
    let endMonth = startYear == eyear ? emonth : 12;
    for (let startMonth = smonth; startMonth <= endMonth; startMonth++) {
      let currentMonthGames = await fetchChessGamesonMonth(
        username,
        startYear,
        startMonth
      );
      allGames = allGames.concat(
        minimizeData(username, currentMonthGames["games"])
      );
      callback1();
      callback2(currentMonthGames["games"].length);
    }
    // only the first year might not start from january
    smonth = 1;
  }
  return allGames;
}

const getYearAndMonth = (joinDate) => {
  // convert to Unix timestamp to milliseconds
  const date = new Date(joinDate * 1000);
  // Get year and month
  const year = date.getFullYear();
  // Months are zero-indexed (0 = January, 1 = February, ..., 11 = December)
  const month = date.getMonth() + 1; // Adding 1 to get 1-based month
  return { year: year, month: month };
};

export { getPlayerProfileInfo, getAllPlayerGames, getYearAndMonth };
