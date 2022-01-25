import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Blocks from "./components/Blocks/Blocks";

function App() {
    return (
        <>
            <div className="main-contents-container">
                <Routes>
                    <Route path="/">
                        <Route index element={<Blocks />}></Route>
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default App;
