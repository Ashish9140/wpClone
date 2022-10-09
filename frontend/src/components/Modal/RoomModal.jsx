import React, { useState, useContext } from 'react'
import { postRoom, getRoom } from '../../http';
import { CartContext } from "../../CartContext";

const RoomModal = ({ modal, setModal }) => {
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const { setAllRooms, user } = useContext(CartContext);
    if (!modal) {
        return null;
    }





    // random colors genrater
    function random_color() {
        var rint = Math.floor(0x100000000 * Math.random());
        return 'rgb(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ')';
    }
    let color = random_color();


    


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (roomName && roomCode) {
            const res = await postRoom({
                roomName: roomName,
                roomAvatar: color,
                roomCode: roomCode,
                members: [user.name]
            });
            const { data } = await getRoom();
            setAllRooms(data);
            setRoomName("");
            setRoomCode("");
            setModal(false);
        }
        else {
            alert('put all the fields');
        }
    }


    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Create Your Room</h4>
                </div>
                <div className="modal-body">
                    <div className="nameSec">
                        <input type="text" placeholder='Room name...' className='form-control mt-2 modal-input' value={roomName} onChange={(e) => { setRoomName(e.target.value) }} />
                    </div>
                    <div className="codeSec">
                        <input type="text" placeholder='Room code...' className='form-control mt-2 modal-input' value={roomCode} onChange={(e) => { setRoomCode(e.target.value) }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success mt-2" onClick={handleSubmit} >Create</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={() => { setModal(false) }}>Close</button>
                </div>
            </div>
        </div>

    )
}

export default RoomModal