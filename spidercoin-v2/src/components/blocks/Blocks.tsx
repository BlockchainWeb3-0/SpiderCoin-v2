import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";
import "./Blocks.scss";
import Cube from "./Cube";
import GenesisBlock from "./GenesisBlock";

const Blocks = () => {
    const [test, setTest] = useState({});

    const blocks = useAxios({
        method: "get",
        baseURL: "http://localhost:3001",
        url: "/blocks",
    });

    useEffect(() => {
        setTest(blocks.data);
    }, [blocks.data]);

    if (blocks.loading) {
        return (
            <>
                <Spinner animation="border" variant="dark" />
            </>
        );
    } else {
        console.log("blocks", blocks.data.chain[0]);
        const genesisBlock = blocks.data.chain[0];
        const restBlocks = blocks.data.chain.slice(1);
        return (
            <>
                <div className="blocks-container">
                    <div className="blockchain">
                        <GenesisBlock blockInfo={genesisBlock} />
                        {restBlocks.map((block, index) => (
                            <Cube key={block.hash} blockInfo={block} />
                        ))}
                    </div>
                </div>
            </>
        );
    }
};

export default Blocks;
