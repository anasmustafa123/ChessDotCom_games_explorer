import React from "react";
import { createContext, useState, useEffect } from "react";
import { getItem } from "../indexDb/indexDb";
import {
  reduceMultiple,
  reduceSingle,
  reduceOnColorChange,
  reduceOnMove,
  reduceUndo,
} from "../components/gamesControl";
const gameContext = createContext("");

const GameContextProvider = ({ children }) => {
  const [filterby, setfilterby] = useState({ gametype: "all" });
  const [selectedColor, setSelectedColor] = useState("white");
  const [totalGames, setTotalGames] = useState([]);
  const [totalGamesSim, setTotalGamesSim] = useState([]);
  const [movesSeq, setMoveSeq] = useState([]);
  const [preFiltering, setPreFiltering] = useState([]);
  const [postFiltering, setpostFiltering] = useState([]);
  const [postFilteringFlag, setpostFilteringFlag] = useState(false);
  const [explorerArray, setExplorerArray] = useState([]);
  const [currentMove, setCurrentMove] = useState("");
  const [updateToggle, setUpdateToggle] = useState(false);
  const [currentMoveNum, setCurrentMoveNum] = useState(1);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    console.log("once game")
    getItem("totalGames").then((data) => {
      let newtotalGames;
      if (data) {
        newtotalGames = JSON.parse(data);
        setTotalGames(newtotalGames);
      }
      getItem("totalGamesSim").then((data) => {
        if (data) {
          let newtotalgamesim = JSON.parse(data);
          setTotalGamesSim(newtotalgamesim);
          let newPreFilteringdata = reduceOnColorChange(
            [...newtotalgamesim],
            "white",
            newtotalGames
          );
          let x = reduceOnMove(
            newPreFilteringdata,
            "",
            0,
            movesSeq,
            (games) => {
              return games;
            }
          );
          setPreFiltering([...newPreFilteringdata]);
          setExplorerArray(x.explorerArray);
        }
      });
    });

    getItem("loaded").then((data) => {
      if (data) {
        setloaded(JSON.parse(data));
      }
    });
  }, []);

  useEffect(() => {
    if (totalGamesSim.length != 0) {
      let x = [];
      let newprefilteringdata = reduceMultiple(
        reduceOnColorChange(
          totalGamesSim,
          selectedColor.toLowerCase(),
          totalGames
        ),
        currentMove,
        currentMoveNum - 1,
        movesSeq
      );
      setPreFiltering(newprefilteringdata);
      if (postFilteringFlag) {
        let newpostfilteringdata = filter(
          filterby.gametype,
          newprefilteringdata
        );
        x = reduceOnMove(
          newpostfilteringdata,
          currentMove,
          currentMoveNum - 1,
          movesSeq,
          (games) => {
            return games;
          }
        );
        setpostFiltering(newpostfilteringdata);
      } else {
        x = reduceOnMove(
          newprefilteringdata,
          currentMove,
          currentMoveNum - 1,
          movesSeq,
          reduceMultiple
        );
      }
      setExplorerArray(x.explorerArray);
    }
  }, [selectedColor]);

  useEffect(() => {
    if (loaded && currentMove !== "") {
      let x = [];
      if (postFilteringFlag) {
        setPreFiltering((oldpre) =>
          reduceSingle(oldpre, currentMove, currentMoveNum)
        );
        x = reduceOnMove(
          postFiltering,
          currentMove,
          currentMoveNum,
          movesSeq,
          reduceSingle
        );
        setpostFiltering(x.gamesAafterMove);
      } else {
        x = reduceOnMove(
          preFiltering,
          currentMove,
          currentMoveNum,
          movesSeq,
          reduceSingle
        );
        setPreFiltering(x.gamesAafterMove);
      }
      setExplorerArray(x.explorerArray);
      setCurrentMoveNum((prevNum) => prevNum + 1);
    }
  }, [updateToggle]);

  const resetExplorerArray = () => {
    let x = [];
    let newprefilteringdata = reduceOnColorChange(
      totalGamesSim,
      selectedColor,
      totalGames
    );
    setPreFiltering(newprefilteringdata);
    if (postFilteringFlag) {
      let newpostfiltering = filter(filterby.gametype, newprefilteringdata);
      setpostFiltering(newpostfiltering);
      x = reduceOnMove(newpostfiltering, "", 0, movesSeq, (games) => {
        return games;
      });
    } else {
      x = reduceOnMove(newprefilteringdata, "", 0, movesSeq, (games) => {
        return games;
      });
    }
    setCurrentMoveNum(1);
    setCurrentMove("");
    setMoveSeq([]);
    setExplorerArray(x.explorerArray);
  };

  function filter(filtertype, newprefilteringdata) {
    let theprefilteringdata = newprefilteringdata
      ? newprefilteringdata
      : preFiltering;
    if (filtertype.toLowerCase() !== "all") {
      let newpostfiltering = theprefilteringdata.filter((game) => {
        return (
          totalGames[game.index]["time_class"].toLowerCase() ==
          filtertype.toLowerCase()
        );
      });
      return newpostfiltering;
    }
    return postFiltering;
  }

  const undoExploreArray = () => {
    if (currentMoveNum == 1) return;
    setCurrentMove(movesSeq.at(-2));
    setMoveSeq((old) => old.slice(0, -1));
    setCurrentMoveNum((old) => old - 1);
    let x = [];
    let newprefilteringdata = reduceUndo(
      reduceOnColorChange([...totalGamesSim], selectedColor, totalGames),
      "",
      currentMoveNum - 2,
      movesSeq
    );
    setPreFiltering(newprefilteringdata);
    // case 1 if u need to apply filtering
    if (postFilteringFlag) {
      // just filter the prefiltring
      // and set the result to postfiltering
      let newpostfilteringdata = filter(filterby.gametype, newprefilteringdata);
      setpostFiltering(newpostfilteringdata);
      x = reduceOnMove(
        newpostfilteringdata,
        "",
        currentMoveNum - 2,
        movesSeq,
        (games) => {
          return games;
        }
      );
    } else {
      // no need to call teh reduceundo for prefiltering as we already done
      x = reduceOnMove(
        newprefilteringdata,
        "",
        currentMoveNum - 2,
        movesSeq,
        (games) => {
          return games;
        }
      );
    }
    setExplorerArray(x.explorerArray);
  };

  return (
    <gameContext.Provider
      value={{
        totalGames,
        setTotalGames,
        totalGamesSim,
        setTotalGamesSim,
        explorerArray,
        setExplorerArray,
        filterby,
        setfilterby,
        postFilteringFlag,
        setpostFilteringFlag,
        postFiltering,
        setpostFiltering,
        currentMove,
        setCurrentMove,
        preFiltering,
        setPreFiltering,
        movesSeq,
        setMoveSeq,
        selectedColor,
        setSelectedColor,
        updateToggle,
        setUpdateToggle,
        currentMoveNum,
        setCurrentMoveNum,
        loaded,
        setloaded,
        undoExploreArray,
        resetExplorerArray,
        filter
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export { GameContextProvider, gameContext };
