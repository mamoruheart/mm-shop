import { Router } from "express";

import {
  get_category,
  delete_category,
  post_category,
  update_category
} from "../controllers/CategoryController";

const router = Router();

router.get("/", get_category);
router.post("/", post_category);
router.put("/:id", update_category);
router.delete("/:id", delete_category);

export default router;
