import Chess_Line from "./Chess_Line";
import "../styles/OutPutSidebar.css";
import { useState } from "react";
import { reduceOnMove } from "./modifyExplore";
export default function OutPutSidebar({
  username,
  inputStartDate,
  inputEndDate,
  explorerArray,
  filter,
  setfilterby,
  setpostFilteringFlag,
  setpostFiltering,
  currentMove,
  currentMoveNum,
  setExplorerArray,
  preFiltering
}) {
  const [options, setOptions] = useState(["All", "Rapid", "Blitz", "Bullet"]);

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

          <select
            onChange={(e) => {
              let x = [];
              if (e.target.selectedIndex == 0) {
                x = reduceOnMove(
                  preFiltering,
                  currentMove,
                  currentMoveNum - 1,
                  (games) => {
                    return games;
                  }
                );
              } else {
                let newpostfiltering = filter(options[e.target.selectedIndex]);
                setpostFilteringFlag((old) => !old);
                setpostFiltering(newpostfiltering);
                x = reduceOnMove(
                  newpostfiltering,
                  currentMove,
                  currentMoveNum - 1,
                  (games) => {
                    return games;
                  }
                );
              }
              console.log(1);
              setExplorerArray(x.explorerArray);
              setfilterby({
                gametype: options[e.target.selectedIndex].toLowerCase(),
              });
            }}
            name="filter"
            id="filter"
          >
            {options.map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
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
