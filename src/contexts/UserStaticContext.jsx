import React, { createContext, useState, useEffect } from "react";
import { getItem } from "../indexDb/indexDb";
const userInfoContext = createContext("");

const UserProvider = ({ children }) => {
  const [username, setUserName] = useState("");
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [gamePeriod, setGamePeriod] = useState("all");
  const [loading, setLoading] = useState(false);
  const [maxRequestCount, setMaxRequestCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [numOfGamesLoaded, setNumOfGamesLoaded] = useState(0);

  useEffect(() => {
    getItem("username").then((data) => {
      if (data) {
        setUserName(JSON.parse(data));
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

  return (
    <userInfoContext.Provider
      value={{
        username,
        setUserName,
        inputStartDate,
        setInputStartDate,
        inputEndDate,
        setInputEndDate,
        gamePeriod,
        setGamePeriod,
        loading,
        setLoading,
        maxRequestCount,
        setMaxRequestCount,
        requestCount,
        setRequestCount,
        numOfGamesLoaded,
        setNumOfGamesLoaded,
      }}
    >
      {children}
    </userInfoContext.Provider>
  );
};

export { UserProvider, userInfoContext };
