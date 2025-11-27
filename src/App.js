import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { BoardsProvider } from "./context/BoardsContext";

import Navbar from "./Navbar";
import Home from "./Home";
import Board from "./components/Board/Board";

function App() {
  return (
    <ThemeProvider>
      <BoardsProvider>
        <Router>
          <div className="app-container">
            <div className="app-navbar">
              <Navbar />
            </div>

            <div className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/board/:boardId?" element={<Board />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BoardsProvider>
    </ThemeProvider>
  );
}

export default App;
