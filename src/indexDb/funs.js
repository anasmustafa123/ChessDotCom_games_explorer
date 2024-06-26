import { setItem } from "./indexDb";

const loadDataToIndexDb = async (
  username,
  loaded,
  totalGames,
  totalGamesSim,
  inputStartDate,
  inputEndDate
) => {
  setItem("username", JSON.stringify(username));
  setItem("totalGames", JSON.stringify(totalGames));
  setItem("totalGamesSim", JSON.stringify(totalGamesSim));
  setItem("loaded", JSON.stringify(loaded));
  setItem("inputStartDate", JSON.stringify(inputStartDate));
  let x = setItem("inputEndDate", JSON.stringify(inputEndDate));
};
export { loadDataToIndexDb };
