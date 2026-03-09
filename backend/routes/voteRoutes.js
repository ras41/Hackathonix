import express from "express";
import {
addVote,
getVotes,
getAllVotesForUser
} from "../controllers/votecontroller.js";

const router = express.Router();

router.post("/", addVote);
router.get("/:pollId", getVotes);
router.get("/user/:userId", getAllVotesForUser);

export default router;