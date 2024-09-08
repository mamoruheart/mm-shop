import { Router } from "express";

import {
  get_order,
  post_order,
  update_order,
  delete_order
} from "../controllers/OrderController";
import { upload } from "../config/multer";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.get("/:id", AuthMiddleware, get_order);
router.post("/", AuthMiddleware, upload.single("file"), post_order);
router.put("/:id", AuthMiddleware, upload.single("file"), update_order);
router.delete("/:id", AuthMiddleware, delete_order);

export default router;
