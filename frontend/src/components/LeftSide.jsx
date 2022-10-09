import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CartContext } from "../CartContext";
import { getChats, logout } from '../http';
import EnterRoomModal from './Modal/EnterRoomModal';
import RoomModal from './Modal/RoomModal';

const LeftSide = ({ socket }) => {
    const { setShowChat, setRoom, setMessageList, allRooms, user, setRightTop, setUser } = useContext(CartContext);
    const [modal, setModal] = useState(false);
    const [enterModal, setEnterModal] = useState(false);
    const history = useHistory();

    const handleClick = async (oneRoom) => {
        setRightTop({
            name: oneRoom.roomName,
            avatar: oneRoom.roomAvatar,
            members: oneRoom.members
        });
        if (!oneRoom.members.includes(user.name)) {
            setEnterModal(true);
        } else {
            let roomId = oneRoom._id;
            setShowChat(true);
            setMessageList([]);
            setRoom(roomId);
            socket.emit("join_room", roomId);
            const { data } = await getChats({ roomId });
            setMessageList(data);
        }
    }

    const handleLogout = async () => {
        await logout();
        history.push('/');
        setUser(null);
    }

    // opne room create modal
    const openModal = () => {
        setModal(true);
    }


    return (
        <div className="col-md-4 pr-0 d-none d-md-block" id='side-1'>
            {/* show modal */}
            <EnterRoomModal enterModal={enterModal} setEnterModal={setEnterModal} />
            <div className="card">

                <div className="card-header">
                    <div className="row">
                        <div className="col-10 col-sm-10 col-md-10 left-top">
                            <div id="container" style={{ backgroundColor: user.avatar }}>
                                <div id="name">{user.name.charAt(0)}</div>
                            </div>
                            <span>{user.name}</span>
                        </div>
                        <div className="col-2 col-sm-2 col-md-2" >
                            <i className="fa fa-arrow-left" onClick={handleLogout}></i>
                        </div>
                    </div>
                </div>

                <li className="list-group-item bgColorOfLi">
                    <button type="button" className="btn btn-secondary mt-2" onClick={openModal}>Create New Group</button>
                    <RoomModal modal={modal} setModal={setModal} />
                </li>

                <li className="list-group-item bgColorOfLi">
                    <input type="text" placeholder='search for a group' className='form-control form-rounded' />
                </li>


                <ul className="list-group list-group-flush left-list">


                    {
                        allRooms.map(oneRoom => {
                            return (
                                <li className="list-group-item list-group-item-action" onClick={() => { handleClick(oneRoom) }} key={oneRoom._id}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div id="container" style={{ backgroundColor: oneRoom.roomAvatar }}>
                                                <div id="name">{oneRoom.roomName.charAt(0)}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-10">
                                            <div className="name" style={{ marginTop: "10px" }}>
                                                {oneRoom.roomName}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>

            </div>
        </div>
    )
};

export default LeftSide;
