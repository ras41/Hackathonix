import express from "express";
import {
addVote,
getVotes,
getAllVotesForUser
} from "../controllers/votecontroller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", addVote);
router.get("/user/:userId", requireAuth, getAllVotesForUser);
router.get("/:pollId", getVotes);

export default router;
