import express from "express";
import { saveImage, getImages } from "../Controllers/imageController.js";
import validator from "../Middleware/Validator.middleware.js";

const router = express.Router();

router.post("/", validator, saveImage);
router.get("/", validator, getImages);

export default router;
