import { setItem } from "./indexDb";

const loadDataToIndexDb = async (
  username,
  loaded,
  totalGames,
  totalGamesSim,
  inputStartDate,
  inputEndDate
) => {
  await setItem("username", JSON.stringify(username));
  await setItem("totalGames", JSON.stringify(totalGames));
  await setItem("totalGamesSim", JSON.stringify(totalGamesSim));
  await setItem("loaded", JSON.stringify(loaded));
  await setItem("inputStartDate", JSON.stringify(inputStartDate));
  await setItem("inputEndDate", JSON.stringify(inputEndDate));
};
export { loadDataToIndexDb };
