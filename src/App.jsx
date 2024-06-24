import "./styles/app.css";
import { useEffect, useState, useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import { reduceOnMove, totalPgn } from "./components/modifyExplore";
import "./styles/react_circular_progressbar.css";
import RightSidebar from "./components/RightSidebar";
import img from "./assets/chessdotcomlogo.png";
import { ToastContainer } from "react-toastify";
import { getItem, setItem, deleteItem } from "./indexDb/indexDb";
import Navbar from "./components/Navbar";
export default function App() {
  const [username, setUserName] = useState("");
  const [totalGames, setTotalGames] = useState([]);
  const [totalGamesSim, setTotalGamesSim] = useState([]);
  const [preFiltering, setPreFiltering] = useState([]);
  const [postFiltering, setpostFiltering] = useState([]);
  const [postFilteringFlag, setpostFilteringFlag] = useState(false);
  const [explorerArray, setExplorerArray] = useState([]);
  const [currentMove, setCurrentMove] = useState("");
  const [movesSeq, setMoveSeq] = useState([]);
  const [updateToggle, setUpdateToggle] = useState(false);
  const [currentMoveNum, setCurrentMoveNum] = useState(1);
  const [loaded, setloaded] = useState(false);
  const [filterby, setfilterby] = useState({ gametype: "all" });
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");

  const loadDataToIndexDb = async (
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

  useEffect(() => {
    getItem("username").then((data) => {
      if (data) {
        setUserName(JSON.parse(data));
      }
    });

    getItem("totalGames").then((data) => {
      if (data) {
        setTotalGames(JSON.parse(data));
      }
    });

    getItem("totalGamesSim").then((data) => {
      if (data) {
        let newtotalgamesim = JSON.parse(data);
        setTotalGamesSim(newtotalgamesim);
        let x = reduceOnMove([...newtotalgamesim], "", 0, (games) => {
          return games;
        });
        setPreFiltering([...newtotalgamesim]);
        setExplorerArray(x.explorerArray);
      }
    });

    getItem("loaded").then((data) => {
      if (data) {
        setloaded(JSON.parse(data));
      }
    });

    getItem("inputStartDate").then((data) => {
      if (data) {
        setInputStartDate(JSON.parse(data));
      }
    });

    getItem("inputEndDate").then((data) => {
      if (data) {
        setInputEndDate(JSON.parse(data));
      }
    });
  }, []);

  useEffect(() => {
    if (loaded && currentMove !== "") {
      console.log("second");
      let x = [];
      if (postFilteringFlag) {
        setPreFiltering((oldpre) =>
          reduceSingle(oldpre, currentMove, currentMoveNum)
        );
        console.log(3);
        x = reduceOnMove(
          postFiltering,
          currentMove,
          currentMoveNum,
          reduceSingle
        );
        setpostFiltering(x.gamesAafterMove);
      } else {
        console.log(2);
        x = reduceOnMove(
          preFiltering,
          currentMove,
          currentMoveNum,
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
    setPreFiltering(totalGamesSim);
    if (postFilteringFlag) {
      let newpostfiltering = filter(filterby.gametype, totalGamesSim);
      setpostFiltering(newpostfiltering);
      x = reduceOnMove(newpostfiltering, "", 0, (games) => {
        return games;
      });
    } else {
      x = reduceOnMove(totalGamesSim, "", 0, (games) => {
        return games;
      });
    }
    setCurrentMoveNum(1);
    setCurrentMove("");
    setMoveSeq([]);
    setExplorerArray(x.explorerArray);
  };
  /**
   *
   * @returns  new postfiltering after filtering the prefiltering arrray
   */
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
      //setPostRerender((old) => !old);
      //setpostFilteringFlag(true);
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
      [...totalGamesSim],
      "",
      currentMoveNum - 2,
      reduceUndo
    );
    setPreFiltering(newprefilteringdata);
    // case 1 if u need to apply filtering
    if (postFilteringFlag) {
      // just filter the prefiltring
      // and set the result to postfiltering
      console.log({ preFiltering });
      let newpostfilteringdata = filter(filterby.gametype, newprefilteringdata);
      setpostFiltering(newpostfilteringdata);
      x = reduceOnMove(
        newpostfilteringdata,
        "",
        currentMoveNum - 2,
        (games) => {
          return games;
        }
      );
    } else {
      // no need to call teh reduceundo for prefiltering as we already done
      x = reduceOnMove(newprefilteringdata, "", currentMoveNum - 2, (games) => {
        return games;
      });
    }
    setExplorerArray(x.explorerArray);
  };

  const reduceSingle = (games, move, moveNum) => {
    return games.filter((game) => {
      if (!game.moves[moveNum - 1]) {
        return false;
      }
      return game.moves[moveNum - 1].toLowerCase() == move.toLowerCase();
    });
  };
  /**
   * @returns games after undoing the last move
   */
  const reduceUndo = (games, move, moveNum) => {
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

  return (
    <>
      <Navbar></Navbar>
      <div className="mainContainer">
        <div className="leftsidebar">
          <img draggable={false} className="logo" src={img} alt="" />
          <div className="mainTitle">CHESS INSIGHT</div>
        </div>
        <ChessBoard
          setCurrentMove={setCurrentMove}
          setUpdateToggle={setUpdateToggle}
          resetExplorerArray={resetExplorerArray}
          setMoveSeq={setMoveSeq}
          undoExploreArray={undoExploreArray}
        ></ChessBoard>
        <RightSidebar
          username={username}
          setUserName={setUserName}
          explorerArray={explorerArray}
          loaded={loaded}
          setloaded={setloaded}
          setTotalGamesSim={setTotalGamesSim}
          setExplorerArray={setExplorerArray}
          setPreFiltering={setPreFiltering}
          setTotalGames={setTotalGames}
          filter={filter}
          setfilterby={setfilterby}
          loadDataToIndexDb={loadDataToIndexDb}
          inputStartDate={inputStartDate}
          inputEndDate={inputEndDate}
          setInputStartDate={setInputStartDate}
          setInputEndDate={setInputEndDate}
          setpostFilteringFlag={setpostFilteringFlag}
          setpostFiltering={setpostFiltering}
          currentMove={currentMove}
          currentMoveNum={currentMoveNum}
          preFiltering={preFiltering}
          movesSeq={movesSeq}
        ></RightSidebar>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
