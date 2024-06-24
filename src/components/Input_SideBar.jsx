import styles from "../styles/Input_SideBar.module.css";
import Loading from "./Loading";
import React from "react";
export default function Input_SideBar({
  username,
  setUserName,
  gamePeriod,
  setGamePeriod,
  setInputStartDate,
  setInputEndDate,
  loading,
  maxRequestCount,
  requestCount,
  numOfGamesLoaded,
}) {
  const handleChange = (e, callback) => {
    callback(e.target.value.replace(/\s+/g, ''));
  };
  const handleDateChange = (e, callback) => {
    let strdate = e.target.value;
    let date = strdate.split("-");
    callback({ year: date[0], month: date[1] });
  };

  return (
    <>
      <div className={styles.sidebar_container}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="chess.com Username"
          value={username}
          onChange={(e) => {
            handleChange(e, setUserName);
          }}
        />
        <div className={styles.periodContainer}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="period"
              id="all"
              value="all"
              checked={gamePeriod == "all"}
              onChange={(e) => {
                handleChange(e, setGamePeriod);
              }}
            />
            <label className={styles.label_horizontal} htmlFor="all">
              All Games
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="period"
              id="specific"
              value="specific"
              checked={gamePeriod == "specific"}
              onChange={(e) => {
                handleChange(e, setGamePeriod);
              }}
            />
            <label className={styles.label_horizontal} htmlFor="specific">
              Select Period
            </label>
          </div>
        </div>
        {gamePeriod == "specific" ? (
          <div className={styles.dateContainer}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                className={styles.label_vertical}
                style={{ fontSize: "19px" }}
                htmlFor="fromDate"
              >
                From
              </label>
              <input
                type="month"
                name="fromDate"
                id="fromDate"
                onChange={(e) => {
                  handleDateChange(e, setInputStartDate);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                className={styles.label_vertical}
                style={{ fontSize: "19px" }}
                htmlFor="toDate"
              >
                To
              </label>
              <input
                type="month"
                name="toDate"
                id="toDate"
                onChange={(e) => {
                  handleDateChange(e, setInputEndDate);
                }}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {loading ? (
          <Loading
            perc={requestCount}
            n={numOfGamesLoaded}
            maxValue={maxRequestCount}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
