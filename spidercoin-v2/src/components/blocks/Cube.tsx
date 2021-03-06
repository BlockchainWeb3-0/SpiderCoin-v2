import React from "react";
import "./Cube.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 640,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const Cube = (blockInfo: any) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="cube" onClick={handleOpen}>
                {blockInfo.blockInfo.header.index}
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div>
                        <b>index</b> : {blockInfo.blockInfo.header.index}
                    </div>
                    <div>
                        <b>prevHash</b> : {blockInfo.blockInfo.header.prevHash}
                    </div>
                    <div>
                        <b>merkleRoot</b> :{" "}
                        {blockInfo.blockInfo.header.merkleRoot}
                    </div>
                    <div>
                        <b>timestamp</b> :{" "}
                        {blockInfo.blockInfo.header.timestamp}
                    </div>
                    <div>
                        <b>hash</b> : {blockInfo.blockInfo.hash}
                    </div>
                    <div>
                        <b>difficulty</b> :{" "}
                        {blockInfo.blockInfo.header.difficulty}
                    </div>
                    <div>
                        <b>nonce</b> : {blockInfo.blockInfo.header.nonce}
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default Cube;
