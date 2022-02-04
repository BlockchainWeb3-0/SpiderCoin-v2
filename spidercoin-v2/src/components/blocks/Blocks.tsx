import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
// import "./Blocks.scss";
import Cube from "./Cube";
import GenesisBlock from "./GenesisBlock";

const Blocks = () => {
    const [test, setTest] = useState({});

    const [blocks, setBlocks] = useState({
        data: [{ hash: "" }],
        loading: false,
    });

    axios
        .get("http://localhost:3001/blocks")
        .then((res) => setBlocks({ ...blocks, data: [{ hash: "1" }] }))
        .then((res) => {
            console.log(blocks);
            return true;
        });

    const txDataList = [{ tx: "test" }];
    useEffect(() => {}, [blocks.data]);
    console.log(test);

    if (blocks.loading) {
        return (
            <>
                <Spinner animation="border" variant="dark" />
            </>
        );
    } else {
        console.log(blocks);
        const genesisBlock = blocks.data[0];
        const restBlocks = blocks.data.slice(1);
        return (
            <>
                <div className="blocks-container">
                    <div className="blockchain">
                        <GenesisBlock blockInfo={genesisBlock} />
                        {restBlocks.map((block, index) => (
                            <Cube
                                key={block.hash}
                                blockInfo={block}
                                txData={txDataList}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }
};

export default Blocks;
