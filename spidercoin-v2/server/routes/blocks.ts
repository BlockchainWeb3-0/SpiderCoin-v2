import express from "express";
import { chain } from "../blockchain/chain";
import * as config from "../config";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.send(chain);
});
router.get("/addblocks", (req, res) => {});

export = router;
