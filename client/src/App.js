import React, { useState } from "react";
import axios from "axios";
import { SERVER } from "./constants";
import "./App.css";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [credits, setCredits] = useState(0);
  const [result, setResult] = useState(["X", "X", "X"]);
  const [spinning, setSpinning] = useState(false);

  // Start a new game session
  const startGame = async () => {
    const response = await axios.post(`${SERVER}/api/slot-machine/start`);
    setSessionId(response.data.sessionId);
    setCredits(response.data.credits);
  };

  // Handle slot spin
  const spinSlots = async () => {
    if (!sessionId || spinning || credits <= 0) return;
    setSpinning(true);
    setResult(["X", "X", "X"]);

    const response = await axios.post(`${SERVER}/api/slot-machine/spin`, { sessionId });
    let newResult = response.data.result;

    // Simulate slot spinning
    setTimeout(() => setResult([newResult[0], "X", "X"]), 1000);
    setTimeout(() => setResult([newResult[0], newResult[1], "X"]), 2000);
    setTimeout(() => {
      setResult(newResult);
      setCredits(response.data.credits);
      setSpinning(false);
    }, 3000);
  };

  // Handle cash out
  const cashOut = async () => {
    if (!sessionId) return;
    await axios.post(`${SERVER}/api/slot-machine/cashout`, { sessionId });
    alert("Cashed out successfully");
    setSessionId(null);
    setCredits(0);
  };

  return (
    <div className='App'>
      <h1>Slot Machine Game</h1>
      <div className='slot-machine'>
        {result.map((slot, index) => (
          <div key={index} className='slot'>
            {slot}
          </div>
        ))}
      </div>
      <p>Credits: {credits}</p>
      <button onClick={spinSlots} disabled={spinning || credits <= 0}>
        Spin
      </button>
      <button onClick={cashOut}>Cash Out</button>
      {!sessionId && <button onClick={startGame}>Start Game</button>}
      <h5>Created by: Kunal Dhaibar</h5>
    </div>
  );
};

export default App;
