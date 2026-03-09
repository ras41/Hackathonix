import express from "express";
import {
createPoll,
getPoll,
getUserPolls,
closePoll,
reopenPoll,
deletePoll
} from "../controllers/pollcontroller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, createPoll);
router.get("/user/:userId", requireAuth, getUserPolls);
router.get("/:id", getPoll);
router.patch("/:id/close", requireAuth, closePoll);
router.patch("/:id/reopen", requireAuth, reopenPoll);
router.delete("/:id", requireAuth, deletePoll);

export default router;
