import Chess_Line from "./Chess_Line";
import "../styles/OutPutSidebar.css";
export default function OutPutSidebar({
  username,
  inputStartDate,
  inputEndDate,
  explorerArray,
}) {
  function getMonthName(monthNumber) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1];
  }
  return (
    <>
      <div className="osMainContainer" style={{ minWidth: "100%" }}>
        <div className="username"> <b>Username:</b> {username}</div>
        <div style={{paddingBottom: "1rem", textAlign: "center"}} className="osMinicontainer">
          <div className="datesContainer">
            <div>From: {`${getMonthName(inputStartDate.month)},${inputStartDate.year}`}</div>
            <div>To: {`${getMonthName(inputEndDate.month)},${inputEndDate.year}`}</div>
          </div>

          <select name="filter" id="filter">
            <option value="All" selected={true}>All</option>
            <option value="Blitz">blitz</option>
            <option value="Rabid">rabid</option>
            <option value="Bullet">bullet</option>
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
