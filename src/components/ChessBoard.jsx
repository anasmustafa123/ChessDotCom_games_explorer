import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "../styles/chessboard.css";
export default function ChessBoard({
  setCurrentMove,
  setUpdateToggle,
  resetExplorerArray,
  setMoveSeq,
  undoExploreArray,
}) {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [chessboardwidth, setChessboardWidth] = useState(1000);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1970) {
        setChessboardWidth(1000);
      } else if (window.innerWidth > 1300) {
        setChessboardWidth(800);
      } else if (window.innerWidth > 760) {
        setChessboardWidth(700);
      } else if (window.innerWidth > 600) {
        setChessboardWidth(500);
      } else if (window.innerWidth > 430) {
        setChessboardWidth(400);
      } else {
        setChessboardWidth(300);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    if (window.innerWidth > 1970) {
      setChessboardWidth(1000);
    } else if (window.innerWidth > 1300) {
      setChessboardWidth(800);
    } else if (window.innerWidth > 760) {
      setChessboardWidth(700);
    } else if (window.innerWidth > 600) {
      setChessboardWidth(500);
    } else if (window.innerWidth > 430) {
      setChessboardWidth(400);
    } else {
      setChessboardWidth(300);
    }

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", setChessboardWidth);
  }, []);
  // modify the game state after each update
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // style possible moves
  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    // no clicked squares yet
    setRightClickedSquares({});
    // responsible for showing the possible move styling
    if (!moveFrom) {
      // get the possible moves on the square
      const hasMoveOptions = getMoveOptions(square);
      // if it has possible moves
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }
    // responsible for making the move
    // so the current clicked square is the destination
    if (!moveTo) {
      // if u already clicked on a square aka (movefrom)
      // retrive all possible moves from it
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      // if the square is a possible move of movefrom
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // if the clicke move is not a possibe move of the movefrom
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        // if clicked on another piece
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }
      setMoveTo(square);
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }
      const move = {
        from: moveFrom,
        to: square,
        promotion: "q",
      };
      makeAMove(move);
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    if (piece) {
      const move = {
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      };
      makeAMove(move);
    }
    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);

    if (result) {
      setCurrentMove(result.san);
      setMoveSeq((old) => {
        return [...old, result.san];
      });
      setUpdateToggle((prev) => !prev);
      setGame(gameCopy);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    //setTimeout(makeRandomMove, 200);
    return true;
  }

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#5d9948",
    border: "none",
    borderRadius: "5px",
    color: "white",
  };
  return (
    <div className="boardWrapper">
      <Chessboard
        id="ClickToMove"
        animationDuration={200}
        boardWidth={chessboardwidth}
        arePremovesAllowed={true}
        arePiecesDraggable={true}
        onPieceDrop={onDrop}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={buttonStyle}
          onClick={() => {
            safeGameMutate((game) => {
              game.reset();
              resetExplorerArray();
            });
            setMoveSquares({});
            setOptionSquares({});
            setRightClickedSquares({});
          }}
        >
          reset
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            safeGameMutate((game) => {
              console.log("undo")
              game.undo();
              undoExploreArray();
            });
            setMoveSquares({});
            setOptionSquares({});
            setRightClickedSquares({});
          }}
        >
          undo
        </button>
      </div>
    </div>
  );
}
