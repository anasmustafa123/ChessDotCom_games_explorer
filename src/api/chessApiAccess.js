async function fetchPlayerProfileInfo(username) {
  const url = `https://api.chess.com/pub/player/${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error getting profile info: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
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
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null; // Or handle the error differently
  }
}

async function getAllPlayerGames(username, loginMonth, loginYear) {
  let allGames = [];
  const date = new Date();
  let currentYear = date.getFullYear();
  let currentMonth = date.getMonth() + 1;
  for (let startYear = loginYear; startYear <= currentYear; startYear++) {
    // if current year last month is the current month
    let endMonth = startYear == currentYear ? currentMonth : 12;
    for (let startMonth = loginMonth; startMonth <= endMonth; startMonth++) {
      let currentMonthGames = await fetchChessGamesonMonth(
        username,
        startYear,
        startMonth
      );
      allGames = allGames.concat(currentMonthGames["games"]);
    }
    // only the first year might not start from january
    loginMonth = 1;
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
