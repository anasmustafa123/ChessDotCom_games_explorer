import "./styles/app.css";
import { useEffect, useState } from "react";
import ChessBoard from "./components/ChessBoard";
import { totalPgn, reduceOnMove } from "./components/modifyExplore";
import "./styles/react_circular_progressbar.css";
import RightSidebar from "./components/RightSidebar";
import img from "./assets/chessdotcomlogo.png";

export default function App() {
  const [totalGames, setTotalGames] = useState([]);
  const [totalGamesSim, setTotalGamesSim] = useState([]);
  const [preFiltering, setPreFiltering] = useState([]);
  const [postFiltering, setpostFiltering] = useState([]);
  const [explorerArray, setExplorerArray] = useState([]);
  const [currentMove, setCurrentMove] = useState("");
  const [movesSeq, setMoveSeq] = useState([]);
  const [updateToggle, setUpdateToggle] = useState(false);
  const [currentMoveNum, setCurrentMoveNum] = useState(1);
  const [prevMoveNum, setPrevMoveNumber] = useState(1);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    if (loaded && currentMove !== "") {
      let x = reduceOnMove(preFiltering, currentMove, currentMoveNum, true);
      setExplorerArray(x.explorerArray);
      setPreFiltering(x.gamesAafterMove);
      setCurrentMoveNum((prevNum) => prevNum + 1);
    }
  }, [updateToggle]);

  const resetExplorerArray = () => {
    setPreFiltering(totalGamesSim);
    setCurrentMoveNum(1);
    setCurrentMove("");
    setUpdateToggle((prev) => !prev);
    setMoveSeq([]);
    let x = reduceOnMove(totalGamesSim, "", 0);
    setExplorerArray(x.explorerArray);
  };

  const undoExploreArray = () => {
    if (currentMoveNum == 1) return;
    let temp = [...totalGamesSim];
    setCurrentMove(movesSeq.at(-2));
    setMoveSeq((old) => old.slice(0, -1));
    let count = 0;
    let newmovenum = currentMoveNum - 1;
    setCurrentMoveNum(newmovenum);
    let newPreFilter = temp.filter((game, index) => {
      count = 0;
      for (let i = 0; i < newmovenum - 1; i++) {
        if (game.moves[i] == movesSeq[i]) {
          count++;
        }
      }
      return count == newmovenum - 1;
    });
    setPreFiltering(newPreFilter);
    let x = reduceOnMove(
      newPreFilter,
      movesSeq[newmovenum - 2],
      newmovenum-1,
      false
    );
    setExplorerArray(x.explorerArray);
    return newPreFilter;
  };

  const makeMove = (games, move, moveNum) => {
    let fullgames = games.filter((game) => {
      if (!game.moves[moveNum - 1]) {
        return false;
      }
      return game.moves[moveNum - 1].toLowerCase() == move.toLowerCase();
    });
    return fullgames;
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

      {/* <Header></Header> */}
      {/*  <Chess_Line moveNum={1} move="c4" playedCount={200} drawPerc={20} blackPerc={20} whitePerc={60}></Chess_Line> */}
    </>
  );
}
