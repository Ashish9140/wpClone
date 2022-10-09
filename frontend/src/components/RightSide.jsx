import React, { useContext, useEffect } from 'react';
import { CartContext } from "../CartContext";
import MessageBody from './MessageBody';
import { useState } from "react";
import Picker from 'emoji-picker-react';
import Dropzone from 'react-dropzone';
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const RightSide = ({ socket }) => {
    const { showChat, room, setMessageList, user, rightTop } = useContext(CartContext);
    const [value, setValue] = useState('');
    const [audio, setAudio] = useState(false)
    const [showPicker, setShowPicker] = useState(false);



    // here we are handling emoji picker
    const onEmojiClick = (event, emojiObject) => {
        setValue(value + emojiObject.emoji);
    };
    const handlePicker = () => {
        if (showPicker) {
            setShowPicker(false);
        } else {
            setShowPicker(true);
        }
    }


    // this is my message data to send 
    let messageData = {
        room: room,
        name: user.name,
        avatar: user.avatar,
        text: value,
        time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
    };



    // message sending or recieving process
    const sendMessage = async () => {
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
    }
    const handleKeyDown = async (e) => {
        if (e.keyCode === 13 && value !== '' && value !== ' ') {
            sendMessage();
            setValue("");
            setShowPicker(false);
        }
    }
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket, setMessageList]);




    // here we are sending images and videos towards backend and socket
    const onDrop = async (files) => {
        // console.log(files);
        const formData = new FormData();
        formData.append("file", files[0]);
        try {
            const res = await axios({
                method: "post",
                url: "/api/upload/file",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            messageData.text = `${res.data.url}`;
            sendMessage();
        } catch (error) {
            console.log(error)
        }
    }




    // record audio
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({ audio: true });

    const sendAudio = async () => {
        const mediaBlob = await fetch(mediaBlobUrl)
            .then(response => response.blob());
        const formData = new FormData()
        formData.append('source', mediaBlob);
        const { data } = await axios({
            method: "post",
            url: "/api/audioUpload",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });
        messageData.text = `${data.path}`;
        sendMessage();
        setAudio(false);
    }

    const handleAudio = () => {
        if (!audio) {
            document.querySelector('.set-Micro').childNodes[0].style.color = "blue";
            startRecording();
            setAudio(true);
        } else {
            document.querySelector('.set-Micro').childNodes[0].style.color = "#0b1a0e";
            stopRecording();
        }
    }

    useEffect(() => {
        if (status === "stopped" && mediaBlobUrl) {
            sendAudio();
        }
    }, [status, mediaBlobUrl])



    return (
        <div className="col-md-8 pl-0 h-100" id='side-2'>

            {showChat ?
                <div className="card">

                    <div className="card-header">
                        <div className="cardDiv">
                            <div>
                                <div id="container" style={{ backgroundColor: rightTop.avatar }}>
                                    <div id="name">{rightTop.name.charAt(0)}</div>
                                </div>
                            </div>
                            <div>
                                <div className="name">
                                    {rightTop.name}
                                </div>
                            </div>
                            <div>
                                {/* <Dropzone onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <i className='fas fa-paperclip fa-2x'></i>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone> */}
                            </div>
                        </div>
                    </div>

                    {/* <MessageBody /> */}
                    <MessageBody />


                    {showPicker ?
                        <div className="emojiReact">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div> : ''
                    }

                    <div className="card-footer">
                        <div className="cardDiv2">
                            <div onClick={handlePicker} style={{ cursor: "pointer" }}>
                                <i className="far fa-grin fa-2x"></i>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder='type your text'
                                    className='form-control form-rounded'
                                    value={value}
                                    onChange={(e) => { setValue(e.target.value) }}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="set-Micro">
                                <i className="fas fa-microphone fa-2x"
                                    // onClick={handleAudio}
                                    style={{ cursor: "pointer" }}
                                />
                                {audio && <span>recording...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                :

                <div id="divStart" className='text-center'>
                    <i className="fas fa-comments mt-5" style={{ fontSize: "250px" }}></i>
                    <h2 className='mt-3' style={{ fontSize: "25px", wordBreak: "break-all" }}>Select a group</h2>
                    <i className="fa fa-arrow-left" onClick={handleLeft}></i>
                </div>
            }

        </div>
    )
};

export default RightSide;
