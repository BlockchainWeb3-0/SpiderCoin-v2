import express from "express";
import { chain } from "../blockchain/chain";
import * as config from "../config";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    //res.send(chain);
});
router.post("/addtransaction", (req, res) => {
    console.log(req.body);
});

export = router;
