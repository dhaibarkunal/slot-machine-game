import request from "supertest";
import { expect } from "chai";
import app from "../index.js";
import { sessions } from "../dbStore.js";

describe("Slot Machine Game API", () => {
  let sessionId = null;

  // Start a new game session
  it("should start a new game session with 10 credits", async () => {
    const res = await request(app).post("/api/slot-machine/start");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("sessionId");
    expect(res.body.credits).to.equal(10);
    sessionId = res.body.sessionId;
  });

  // Test the spinning functionality for a valid session
  it("should spin the slots and return a result with updated credits", async () => {
    const res = await request(app).post("/api/slot-machine/spin").send({ sessionId });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("result");
    expect(res.body.result.length).to.equal(3);
    expect(res.body).to.have.property("isWin");
    expect(res.body).to.have.property("credits");
  });

  // Test session validity with insufficient credits
  it("should fail to spin when the session credits are 0 or invalid", async () => {
    // Manually set session credits to 0 for this test case
    sessions[sessionId].credits = 0;

    const res = await request(app).post("/api/slot-machine/spin").send({ sessionId });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  // Test the cheating logic at 40+ credits
  it("should apply cheating logic between 40 and 60 credits", async () => {
    // Manually set session credits to 50 to test cheating logic
    sessions[sessionId].credits = 50;

    const res = await request(app).post("/api/slot-machine/spin").send({ sessionId });

    expect(res.status).to.equal(200);
    expect(res.body.credits).to.be.within(40, 60);
  });

  // Test the cashout functionality
  it("should cash out and end the session", async () => {
    const res = await request(app).post("/api/slot-machine/cashout").send({ sessionId });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Cashed out successfully");
  });

  // Test invalid session on cashout
  it("should return an error when trying to cash out an invalid session", async () => {
    const res = await request(app).post("/api/slot-machine/cashout").send({ sessionId: "invalid-session-id" });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });
});
