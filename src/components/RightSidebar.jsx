import Input_SideBar from "./Input_SideBar";
import OutPutSidebar from "./OutPutSidebar";
import styles from "../styles/RightSidebar.module.css";
import { getPlayerProfileInfo, getAllPlayerGames } from "../api/chessApiAccess";
import { userInfoContext } from "../contexts/UserStaticContext";
import { gameContext } from "../contexts/UserGameContext";
import React, { useContext } from "react";
import { reduceOnColorChange, reduceOnMove, reducePgn } from "./gamesControl";
import { loadDataToIndexDb } from "../indexDb/funs";
export default function RightSidebar() {
  const {
    username,
    inputStartDate,
    setInputStartDate,
    inputEndDate,
    setInputEndDate,
    setLoading,
    setMaxRequestCount,
    setRequestCount,
    setNumOfGamesLoaded,
  } = useContext(userInfoContext);
  const {
    setTotalGames,
    setTotalGamesSim,
    setExplorerArray,
    currentMove,
    setPreFiltering,
    movesSeq,
    selectedColor,
    currentMoveNum,
    loaded,
    setloaded,
  } = useContext(gameContext);

  const getMonthCount = (finalDate) => {
    return (
      (finalDate.eyear - finalDate.syear - 1) * 12 +
      finalDate.emonth +
      12 -
      finalDate.smonth +
      1
    );
  };

  const fixPeriodDates = (jmonth, jyear) => {
    let final = { syear: "", smonth: "", eyear: "", emonth: "" };
    // incase selected date is before login to chess.com
    if (
      inputStartDate == "" ||
      inputStartDate.year < jyear ||
      (inputStartDate.year == jyear && inputStartDate.month < jmonth)
    ) {
      // adjust to join date
      setInputStartDate({
        year: jyear,
        month: jmonth,
      });
      final.syear = jyear;
      final.smonth = jmonth;
    } else {
      final.syear = Number(inputStartDate.year);
      final.smonth = Number(inputStartDate.month);
    }
    let today = new Date();
    let cyear = today.getFullYear();
    let cmonth = today.getMonth() + 1;
    // incase if end date is after current date
    if (
      inputEndDate == "" ||
      inputEndDate.year > cyear ||
      (inputEndDate.year == cyear && inputEndDate.month > cmonth)
    ) {
      // addjust to current month
      setInputEndDate({ year: cyear, month: cmonth });
      final.eyear = cyear;
      final.emonth = cmonth;
    } else {
      final.eyear = Number(inputEndDate.year);
      final.emonth = Number(inputEndDate.month);
    }
    return final;
  };

  /**
   * This callback will be called after loading the chess.com data for each month by `getAllPlayerGames`.
   * @callback incrementRequestCount
   */
  const incrementRequestCount = () => {
    setRequestCount((prevRequestCount) => prevRequestCount + 1);
  };
  /**
   * This callback will be called after loading the chess.com data for each month by `getAllPlayerGames`.
   * @param {Number} currentMonthGamesNum number of game loaded in curren month
   * @callback incrementNumOfGamesLoaded
   */
  const incrementNumOfGamesLoaded = (currentMonthGamesNum) => {
    setNumOfGamesLoaded(
      (prevNumOfGamesLoaded) => prevNumOfGamesLoaded + currentMonthGamesNum
    );
  };

  return (
    <div className={styles.rightSidebarContainer}>
      <h1>CHESS INSIGHT</h1>
      {!loaded ? (
        <>
          <Input_SideBar></Input_SideBar>
          <button
            className={styles.submitBtn}
            onClick={async () => {
              setLoading(true);
              getPlayerProfileInfo(username)
                .then((x) => {
                  let finalDate = fixPeriodDates(x.joinMonth, x.joinYear);
                  setMaxRequestCount(getMonthCount(finalDate));
                  getAllPlayerGames(
                    username,
                    finalDate.smonth,
                    finalDate.syear,
                    finalDate.emonth,
                    finalDate.eyear,
                    incrementRequestCount,
                    incrementNumOfGamesLoaded
                  )
                    .then(async (allGames) => {
                      if (allGames) {
                        setLoading(false);
                        setloaded(true);
                        setTotalGames(allGames);
                        let newTotalGameSim = reducePgn(allGames);
                        setTotalGamesSim(newTotalGameSim);

                        let prefilteringdata = reduceOnColorChange(
                          newTotalGameSim,
                          selectedColor.toLowerCase(),
                          allGames
                        );

                        let x = [];

                        if (movesSeq.length > 0) {
                          x = reduceOnMove(
                            prefilteringdata,
                            currentMove,
                            currentMoveNum - 1,
                            movesSeq,
                            reduceMultiple
                          );
                          setPreFiltering(x.gamesAafterMove);
                        } else {
                          setPreFiltering(prefilteringdata);
                          x = reduceOnMove(
                            prefilteringdata,
                            "",
                            0,
                            movesSeq,
                            (games) => {
                              return games;
                            }
                          );
                        }
                        setExplorerArray(x.explorerArray);

                        loadDataToIndexDb(
                          username,
                          true,
                          allGames,
                          newTotalGameSim,
                          { month: finalDate.smonth, year: finalDate.syear },
                          { year: finalDate.eyear, month: finalDate.emonth }
                        );
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Load
          </button>
        </>
      ) : (
        <OutPutSidebar></OutPutSidebar>
      )}
    </div>
  );
}
