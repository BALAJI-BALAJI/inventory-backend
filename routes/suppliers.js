import express from "express";
import Supplier from "../models/Supplier.js";

const router = express.Router();

router.get("/", async (req,res)=>res.json(await Supplier.find()));
router.post("/", async (req,res)=>res.json(await new Supplier(req.body).save()));
router.put("/:id", async (req,res)=>res.json(await Supplier.findByIdAndUpdate(req.params.id, req.body, {new:true})));
router.delete("/:id", async (req,res)=>res.json(await Supplier.findByIdAndDelete(req.params.id)));

export default router;
