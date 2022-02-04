import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Blocks from "./components/blocks/Blocks";
import NavBar from "./components/navBar/NavBar";
import Deposit from "./components/trade/deposit/Deposit";
import Withdraw from "./components/trade/withdraw/Withdraw";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";

function App() {
    return (
        <>
            <NavBar />
            <div className="main-contents-container">
                <Routes>
                    <Route path="/">
                        <Route index element={<Blocks />}></Route>
                        <Route path="blocks" element={<Blocks />} />
                        <Route path="wallet" element={<Blocks />} />
                        <Route path="trade">
                            <Route path="deposit" element={<Deposit />} />
                            <Route path="withdraw" element={<Withdraw />} />
                        </Route>
                        <Route path="user">
                            <Route path="signin" element={<Signin />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default App;
