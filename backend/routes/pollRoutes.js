import express from "express";
import {
createPoll,
getPoll,
getUserPolls,
closePoll,
reopenPoll,
deletePoll
} from "../controllers/pollcontroller.js";

const router = express.Router();

router.post("/", createPoll);
router.get("/:id", getPoll);
router.get("/user/:userId", getUserPolls);
router.patch("/:id/close", closePoll);
router.patch("/:id/reopen", reopenPoll);
router.delete("/:id", deletePoll);

export default router;