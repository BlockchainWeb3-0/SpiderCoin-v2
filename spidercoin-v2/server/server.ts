import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import _ from "lodash";

import { cors, addHeaders } from "./middlewares/cors";
import index from "./routes";
import user from "./routes/user";
import blocks from "./routes/blocks";
import transactions from "./routes/transactions";

const app = express();
app.use(helmet());
app.use(cors);
app.use(addHeaders);
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const http_port: number = 3001;

app.use("/", index);
app.use("/user", user);
app.use("/blocks", blocks);
app.use("/transactions", transactions);

const server = app.listen(http_port, () => {
    console.log(`
    ####################################
    🛡️  Server listening on port: ${http_port}🛡️
    ####################################`);
});
