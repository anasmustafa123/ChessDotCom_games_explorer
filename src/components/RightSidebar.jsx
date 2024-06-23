import React from "react";
import { useState } from "react";
import Input_SideBar from "./Input_SideBar";
import OutPutSidebar from "./OutPutSidebar";
import styles from "../styles/RightSidebar.module.css";
import { getPlayerProfileInfo, getAllPlayerGames } from "../api/chessApiAccess";
import { totalPgn, reduceOnMove } from "./modifyExplore";

export default function RightSidebar({
  username,
  setUserName,
  setTotalGames,
  setPreFiltering,
  setExplorerArray,
  setTotalGamesSim,
  inlineStyles,
  explorerArray,
  loaded,
  setloaded,
  filter,
  setfilterby,
  loadDataToIndexDb,
  inputEndDate,
  setInputEndDate,
  inputStartDate,
  setInputStartDate,
  setpostFilteringFlag,
  setpostFiltering,
  currentMove,
  currentMoveNum,
  preFiltering,
  movesSeq,
}) {
  const [gamePeriod, setGamePeriod] = useState("all");
  const [loading, setLoading] = useState(false);
  const [maxRequestCount, setMaxRequestCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [numOfGamesLoaded, setNumOfGamesLoaded] = useState(0);

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
    <div className={styles.rightSidebarContainer} style={{ ...inlineStyles }}>
      <h1>CHESS INSIGHT</h1>
      {!loaded ? (
        <>
          <Input_SideBar
            username={username}
            setUserName={setUserName}
            gamePeriod={gamePeriod}
            setGamePeriod={setGamePeriod}
            setInputStartDate={setInputStartDate}
            setInputEndDate={setInputEndDate}
            loading={loading}
            maxRequestCount={maxRequestCount}
            requestCount={requestCount}
            numOfGamesLoaded={numOfGamesLoaded}
          ></Input_SideBar>
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
                        setTotalGames(allGames);
                        setLoading(false);
                        setloaded(true);
                        let prefilteringdata = totalPgn(allGames);
                        setTotalGamesSim(prefilteringdata);
                        setPreFiltering(prefilteringdata);
                        let x = reduceOnMove(
                          prefilteringdata,
                          "",
                          0,
                          (games) => {
                            return games;
                          }
                        ).explorerArray;
                        await loadDataToIndexDb(
                          true,
                          allGames,
                          prefilteringdata,
                          { month: finalDate.smonth, year: finalDate.syear },
                          { year: finalDate.eyear, month: finalDate.emonth }
                        );
                        setExplorerArray(x);
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
        <OutPutSidebar
          username={username}
          inputEndDate={inputEndDate}
          inputStartDate={inputStartDate}
          explorerArray={explorerArray}
          filter={filter}
          setfilterby={setfilterby}
          setpostFilteringFlag={setpostFilteringFlag}
          setpostFiltering={setpostFiltering}
          currentMove={currentMove}
          currentMoveNum={currentMoveNum}
          setExplorerArray={setExplorerArray}
          preFiltering={preFiltering}
          movesSeq={movesSeq}
        ></OutPutSidebar>
      )}
    </div>
  );
}
