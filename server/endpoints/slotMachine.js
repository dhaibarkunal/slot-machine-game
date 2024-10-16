import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getRandomSymbol, getReward } from "../utils/slotMachine.js";
import { sessions } from "../dbStore.js";

const router = express.Router();

router.post("/start", (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { credits: 10 };
  res.json({ sessionId, credits: 10 });
});

// Spin the slot machine
router.post("/spin", (req, res) => {
  const { sessionId } = req.body;
  const session = sessions[sessionId];

  if (!session || session.credits <= 0) {
    return res.status(400).json({ error: "Invalid session or insufficient credits" });
  }

  session.credits--;

  // Roll the slots
  let result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  let isWin = result.every((symbol) => symbol === result[0]);

  // Cheating logic
  if (session.credits >= 40 && session.credits < 60) {
    if (isWin && Math.random() < 0.3) {
      result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      isWin = result.every((symbol) => symbol === result[0]);
    }
  } else if (session.credits >= 60) {
    if (isWin && Math.random() < 0.6) {
      result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      isWin = result.every((symbol) => symbol === result[0]);
    }
  }

  // Calculate reward
  let reward = 0;
  if (isWin) {
    reward = getReward(result[0]);
    session.credits += reward;
  }

  res.json({ result, isWin, credits: session.credits, reward });
});

// Cash out endpoint
router.post("/cashout", (req, res) => {
  const { sessionId } = req.body;
  const session = sessions[sessionId];

  if (session) {
    console.log(`Cashing out ${session.credits} credits`);
    delete sessions[sessionId];
    res.json({ message: "Cashed out successfully", credits: session.credits });
  } else {
    res.status(400).json({ error: "Invalid session" });
  }
});

export default router;
