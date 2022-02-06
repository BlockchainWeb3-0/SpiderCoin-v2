import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const Mempool = () => {
    const params: any = {
        method: "post",
        baseURL: `http://localhost:3001`,
        url: "/blocks/mineblock",
    };

    const addTx = async () => {
        const result = await axios.request(params);
        console.log(result);
    };

    return (
        <div>
            <Button onClick={addTx} className="withdraw_btn">
                Mine
            </Button>
        </div>
    );
};

export default Mempool;
