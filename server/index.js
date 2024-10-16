import express from "express";
import cors from "cors";
import slotMachine from "./endpoints/slotMachine.js";

const app = express();
app.use(cors());
app.use(express.json());

// App routes
app.use("/api/slot-machine", slotMachine);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
