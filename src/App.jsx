import ChessBoard from "./components/ChessBoard";
import Test from "./components/Test";
import {
  getPlayerProfileInfo,
  getAllPlayerGames,
  getYearAndMonth,
} from "./api/chessApiAccess";
export default function App() {
  return (
    <div>
      <Test></Test>
      <ChessBoard />
    </div>
  );
}
