import React, { useState, useContext } from 'react'
import { enterRoom, getRoom } from '../../http';
import { CartContext } from "../../CartContext";

const EnterRoomModal = ({ enterModal, setEnterModal }) => {
    const [roomCode, setRoomCode] = useState('');
    const { user, rightTop, setAllRooms } = useContext(CartContext);
    if (!enterModal) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (roomCode) {
            const { data } = await enterRoom({
                roomCode,
                userName: user.name,
                roomName: rightTop.name
            })
            if (data.message) {
                alert(data.message);
            } else {
                const { data } = await getRoom();
                setAllRooms(data);
            }
            setRoomCode('');
            setEnterModal(false);
        } else {
            alert("Enter room code");
        }
    }


    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Enter Room Code</h4>
                </div>
                <div className="modal-body">
                    <div className="codeSec">
                        <input type="text" placeholder='Room code...' className='form-control mt-2 modal-input' value={roomCode} onChange={(e) => { setRoomCode(e.target.value) }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success mt-2" onClick={handleSubmit}>Enter</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={() => { setEnterModal(false) }}>Close</button>
                </div>
            </div>
        </div>
    )
}


export default EnterRoomModal