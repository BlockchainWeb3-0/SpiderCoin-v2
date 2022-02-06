import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { Button } from "react-bootstrap";
import { WithDrawPostType } from "../../../models/post.interface";
import { Post } from "../../../api/api";

const Withdraw = () => {
    const [postData, setPostData] = useState({
        TxInAddress: "",
        TxOutAddress: "",
        sign: "",
        amount: 0,
    });

    const params: any = {
        method: "post",
        baseURL: `http://localhost:3001`,
        url: "/transactions/addtransaction",
        data: postData,
    };

    const addTx = async () => {
        const result = await axios.request(params);
        console.log(result);
    };

    // TODO: 내 로그인 정보에서 가져올 것임
    const textOnMyAddresss = (e: any) => {
        const myAddr: string = e.target.value;
        setPostData({ ...postData, TxInAddress: myAddr });
    };

    const textOnAddresss = (e: any) => {
        const addr: string = e.target.value;
        setPostData({ ...postData, TxOutAddress: addr });
    };
    const textOnAmount = (e: any) => {
        const amount: number = parseInt(e.target.value);
        setPostData({ ...postData, amount: amount });
    };
    const textOnPrivateKey = (e: any) => {
        const privateKey: string = e.target.value;
        setPostData({ ...postData, sign: privateKey });
    };

    return (
        <>
            <div className="withdraw_container">
                <div className="withdraw_title">WithDraw!</div>
                <div className="withdraw_input">
                    {/* TODO: 내 로그인 정보에서 가져올 것임. */}
                    <TextField
                        required
                        label="My Address"
                        variant="standard"
                        name="address"
                        onChange={textOnMyAddresss}
                        sx={{ width: "100%", displayPrint: "block" }}
                    />
                    <TextField
                        required
                        label="Wallet Address"
                        variant="standard"
                        name="address"
                        onChange={textOnAddresss}
                        sx={{ width: "100%", displayPrint: "block" }}
                    />
                    <TextField
                        required
                        label="PrivateKey"
                        variant="standard"
                        name="privatekey"
                        onChange={textOnPrivateKey}
                        sx={{
                            width: "100%",
                            displayPrint: "block",
                            marginTop: "20px",
                        }}
                    />
                    <TextField
                        required
                        label="Amount"
                        variant="standard"
                        name="amount"
                        value={postData.amount}
                        onChange={textOnAmount}
                        sx={{
                            width: 200,
                            displayPrint: "block",
                            marginTop: "20px",
                        }}
                    />
                    <Button onClick={addTx} className="withdraw_btn">
                        Add Transaction
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Withdraw;
