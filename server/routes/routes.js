import express from "express";
const router = express.Router();
import controller from "../controller/controller.js";


import multer from "multer";
import csvParser from "csv-parser"
import fs from "fs";
const upload = multer({ dest: "../controller/uploads/"});

import {validateRow, validateTransaction, handleValidationError } from "../middleware/middleware.js";


router.get("/", controller.getAllTransactions);

router.get("/:id", controller.getTransactionById);

router.post("/",validateTransaction,handleValidationError, controller.addTransaction);

router.post("/csv", upload.single("csv"),validateRow, controller.addCsvTransaction);


router.put("/:id",validateTransaction,handleValidationError, controller.updateTransaction);

router.delete("/:id", controller.deleteTransaction);


export default router;