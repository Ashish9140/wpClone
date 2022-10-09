import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';
import { CartContext } from "../CartContext";
import React, { useContext, useEffect } from 'react';
import { getRoom } from '../http';
import io from "socket.io-client";
// const socket = io.connect('http://localhost:5000');
const socket = io.connect();

const ChatBox = () => {
    const { setAllRooms } = useContext(CartContext);

    useEffect(async () => {
        const { data } = await getRoom();
        setAllRooms(data);
    }, [])


    return (
        <>
            <span className="top"></span>
            <div className="container-fluid bg-white chatbox shadow-lg rounded">
                <div className="row h-100">

                    {/* COl-md-4 */}
                    <LeftSide socket={socket} />

                    {/* COl-md-8 */}
                    <RightSide socket={socket} />

                </div>
            </div>
        </>
    )
};

export default ChatBox;
