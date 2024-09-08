import { Router } from "express";

import {
  get_customer,
  delete_customer,
  post_customer,
  update_customer
} from "../controllers/CustomerController";
// import { upload } from "../config/multer";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.get("/", get_customer);
router.post("/", post_customer);
router.put("/:id", AuthMiddleware, update_customer);
router.delete("/:id", AuthMiddleware, delete_customer);

export default router;
