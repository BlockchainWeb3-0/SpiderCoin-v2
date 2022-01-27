import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Blocks from "./components/blocks/Blocks";
import Mempool from "./components/transaction/mempool/Mempool";
import NavBar from "./components/navBar/NavBar";
import Signin from "./components/user/Signin";

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
                        <Route path="transaction">
                            <Route path="mempool" element={<Mempool />} />
                            <Route path="send" element={<Blocks />} />
                        </Route>
                        <Route path="user">
                            <Route path="signin" element={<Signin />} />
                            <Route path="signup" element={<Blocks />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default App;
