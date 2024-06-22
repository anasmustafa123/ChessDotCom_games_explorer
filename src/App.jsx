import "./styles/app.css";
import { useEffect, useState } from "react";
import ChessBoard from "./components/ChessBoard";
import { reduceOnMove } from "./components/modifyExplore";
import "./styles/react_circular_progressbar.css";
import RightSidebar from "./components/RightSidebar";
import img from "./assets/chessdotcomlogo.png";
import { ToastContainer } from "react-toastify";
export default function App() {
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
  const [prevMoveNum, setPrevMoveNumber] = useState(1);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    if (loaded && currentMove !== "") {
      let x = [];
      if (postFilteringFlag) {
        x = reduceOnMove(
          postFiltering,
          currentMove,
          currentMoveNum,
          reduceSingle
        );
        setpostFiltering(x.gamesAafterMove);
      } else {
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

  useEffect(() => {
    let x = [];
    if (postFilteringFlag) {
      x = reduceOnMove(postFiltering, "", currentMoveNum - 1, reduceMultible);
      setpostFiltering(x.gamesAafterMove);
    } else {
      x = reduceOnMove(preFiltering, "", currentMoveNum - 1, reduceMultible);
      setPreFiltering(x.gamesAafterMove);
    }

    setExplorerArray(x.explorerArray);
  }, [postFilteringFlag]);

  const resetExplorerArray = () => {
    setPreFiltering(totalGamesSim);
    setCurrentMoveNum(1);
    setCurrentMove("");
    //setUpdateToggle((prev) => !prev);
    setMoveSeq([]);
    let x = reduceOnMove(totalGamesSim, "", 0, (games) => {
      return games;
    });
    setExplorerArray(x.explorerArray);
  };

  const undoExploreArray = () => {
    if (currentMoveNum == 1) return;
    setCurrentMove(movesSeq.at(-2));
    setMoveSeq((old) => old.slice(0, -1));
    setCurrentMoveNum((old) => old - 1);
    let x = reduceOnMove(
      [...totalGamesSim],
      "",
      currentMoveNum - 2,
      reduceUndo
    );
    if (postFilteringFlag) {
      setpostFiltering(x.gamesAafterMove);
    } else {
      setPreFiltering(x.gamesAafterMove);
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

  const reduceMultible = (games, move, moveNum) => {
    let count = 0;
    return games.filter((game) => {
      count = 0;
      movesSeq.forEach((move, i) => {
        game.moves[i] == move ? count++ : "";
      });
      return count == moveNum - 1;
    });
  };

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
      <div className="mainContainer">
        <div className="leftsidebar">
          <img draggable={false} className="logo" src={img} alt="" />
        </div>
        <ChessBoard
          setCurrentMove={setCurrentMove}
          setUpdateToggle={setUpdateToggle}
          resetExplorerArray={resetExplorerArray}
          setMoveSeq={setMoveSeq}
          undoExploreArray={undoExploreArray}
        ></ChessBoard>

        <RightSidebar
          setTotalGames={setTotalGames}
          setTotalGamesSim={setTotalGamesSim}
          setPreFiltering={setPreFiltering}
          setExplorerArray={setExplorerArray}
          currentMove={currentMove}
          setCurrentMove={setCurrentMove}
          currentMoveNum={currentMoveNum}
          setCurrentMoveNum={setCurrentMoveNum}
          explorerArray={explorerArray}
          loaded={loaded}
          setloaded={setloaded}
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
