import Chess_Line from "./Chess_Line";
import "../styles/OutPutSidebar.css";
import { reduceOnMove } from "./gamesControl";
import React, { useContext, useState } from "react";
import { gameContext } from "../contexts/UserGameContext";
import { userInfoContext } from "../contexts/UserStaticContext";
export default function OutPutSidebar() {
  const {
    explorerArray,
    filter,
    setfilterby,
    setpostFilteringFlag,
    setpostFiltering,
    currentMove,
    currentMoveNum,
    setExplorerArray,
    preFiltering,
    movesSeq,
    setSelectedColor,
    selectedColor,
  } = useContext(gameContext);
  const {username, inputStartDate, inputEndDate} = useContext(userInfoContext);
  const [options, setOptions] = useState([
    "All Games",
    "Rapid",
    "Blitz",
    "Bullet",
  ]);
  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  }

  const displayMovesSeq = (movesSeq) => {
    let res = "";
    movesSeq.forEach((move, i) => {
      if (i % 2 == 0) {
        res += `${i / 2 + 1}.${move}`;
      } else {
        res += `.${move} `;
      }
    });
    return res;
  };

  return (
    <>
      <div className="osMainContainer" style={{ minWidth: "100%" }}>
        <div className="username">
          {" "}
          <b>Username:</b> {username}
        </div>
        <div
          style={{ paddingBottom: "1rem", textAlign: "center" }}
          className="osMinicontainer"
        >
          <div className="datesContainer">
            <div>
              From:{" "}
              {`${getMonthName(inputStartDate.month)},${inputStartDate.year}`}
            </div>
            <div>
              To: {`${getMonthName(inputEndDate.month)},${inputEndDate.year}`}
            </div>
          </div>
          <div>
            <select
              id="playerColor"
              className="filter"
              onChange={(e) => {
                setSelectedColor(e.target.value.toLowerCase());
              }}
              value={selectedColor}
            >
              {["White", "Black"].map((color, index) => (
                <option value={color.toLowerCase()} key={index}>
                  {color}
                </option>
              ))}
            </select>
            <select
              className="filter"
              onChange={(e) => {
                setpostFilteringFlag(false);
                let x = [];
                if (e.target.selectedIndex == 0) {
                  x = reduceOnMove(
                    preFiltering,
                    currentMove,
                    currentMoveNum - 1,
                    movesSeq,
                    (games) => {
                      return games;
                    }
                  );
                } else {
                  let newpostfiltering = filter(
                    options[e.target.selectedIndex]
                  );
                  setpostFilteringFlag(true);
                  setpostFiltering(newpostfiltering);
                  x = reduceOnMove(
                    newpostfiltering,
                    currentMove,
                    currentMoveNum - 1,
                    movesSeq,
                    (games) => {
                      return games;
                    }
                  );
                }
                setExplorerArray(x.explorerArray);
                setfilterby({
                  gametype: options[e.target.selectedIndex].toLowerCase(),
                });
              }}
              name="filter"
            >
              {options.map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="movesDone">{displayMovesSeq(movesSeq)}</div>
        <div className="lines">
          {explorerArray.map((line, index) => (
            <Chess_Line
              key={index}
              whitePerc={Math.round(line.ratio.white)}
              blackPerc={Math.floor(line.ratio.black)}
              drawPerc={Math.floor(line.ratio.draw)}
              move={line.move}
              moveNum={line.moveNum}
              playedCount={line.n}
            ></Chess_Line>
          ))}
        </div>
      </div>
    </>
  );
}
