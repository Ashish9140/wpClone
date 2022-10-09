import React, { useContext, useEffect } from 'react';
import { CartContext } from "../CartContext";
import ScrollToBottom from "react-scroll-to-bottom";

const MessageBody = () => {
    const { messageList, user } = useContext(CartContext);

    return (
        <ScrollToBottom className="message-container">
            <div className="card-body">
                {
                    messageList.map((message, index) => {
                        if (message.name === user.name) {
                            return (
                                <div className="row justify-content-end" key={index}>
                                    <div className="col-6 col-sm-7 col-md-7">
                                        <p className='sent justify-content-end float-right'>
                                            {message.text}
                                            <span className='time float-right'>{message.time}</span>
                                        </p>
                                    </div>
                                    <div className="col-2 col-sm-1 col-md-1">
                                        <div id="containerforbody" style={{ backgroundColor: message.avatar }}>
                                            <div id="nameforbody">{message.name.charAt(0)}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div className="row" key={index}>
                                    <div className="col-2 col-sm-1 col-md-1">
                                        <div id="containerforbody" style={{ backgroundColor: message.avatar }}>
                                            <div id="nameforbody">{message.name.charAt(0)}</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-7 col-md-7">
                                        <p className='receive'>
                                            {message.text}
                                            <span className='time float-right'>{message.name}({message.time})</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    })
                }

            </div>
        </ScrollToBottom >
    )
};

export default MessageBody;
