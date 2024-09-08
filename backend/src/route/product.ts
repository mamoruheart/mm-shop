import { Router } from "express";

import {
  get_product,
  delete_product,
  post_product,
  update_product
} from "../controllers/ProductController";
import { upload } from "../config/multer";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.get("/", get_product);
router.post("/", upload.array("files", 20), AuthMiddleware, post_product);
router.put("/:id", upload.array("files", 20), AuthMiddleware, update_product);
router.delete("/:id", AuthMiddleware, delete_product);

export default router;
