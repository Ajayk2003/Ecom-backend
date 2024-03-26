import { Router } from "express"
import { getSellers, deleteSeller, updateSeller, getSellerInfo } from "../controllers/seller.controller"

const router = Router()

router.route("/").get(getSellers)
router.route("/:id").put(updateSeller).delete(deleteSeller)
router.route("/SELLERINFO").get(getSellerInfo)

export default router
