import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/", async (req,res)=>res.json(await Transaction.find().sort({date:-1})));

export default router;
