import React from "react";
import "./styles/app.css";
import ChessBoard from "./components/ChessBoard";
import "./styles/react_circular_progressbar.css";
import RightSidebar from "./components/RightSidebar";
import img from "./assets/chessdotcomlogo.png";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { GameContextProvider } from "./contexts/UserGameContext";
export default function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="mainContainer">
        <div className="leftsidebar">
          <img draggable={false} className="logo" src={img} alt="" />
          <div className="mainTitle">CHESS INSIGHT</div>
        </div>
        <GameContextProvider>
          <ChessBoard></ChessBoard>
          <RightSidebar></RightSidebar>
        </GameContextProvider>
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
