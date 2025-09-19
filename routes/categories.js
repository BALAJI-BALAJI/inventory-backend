import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req,res)=>res.json(await Category.find()));
router.post("/", async (req,res)=>res.json(await new Category(req.body).save()));
router.put("/:id", async (req,res)=>res.json(await Category.findByIdAndUpdate(req.params.id, req.body, {new:true})));
router.delete("/:id", async (req,res)=>res.json(await Category.findByIdAndDelete(req.params.id)));

export default router;
