const router = require('express').Router();
const ChatModal = require('./models/chat-data');
const RoomModal = require('./models/room-model');
const UserModal = require('./models/user-model');
const TokenModal = require('./models/token-model');
const crypto = require('crypto');
const Jimp = require('jimp');
const path = require('path');
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const UserDto = require('./dtos/user-dto');
const authMiddleware = require('./authMiddleware');
const userModel = require('./models/user-model');
const fs = require('fs');
const multer = require('multer');
const upload = multer();


// user routes
router.post("/api/user/signup", async (req, res) => {
    const { email, name, pass, avatar } = req.body;

    let user;
    user = await UserModal.findOne({ email: email });
    if (!user) {
        user = await UserModal.create({ email, name, avatar, pass });
    }
    else {
        return res.json({ message: "User already exist", user: user });
    }

    // Token
    const accessToken = jwt.sign({ _id: user._id }, accessTokenSecret, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, refreshTokenSecret, { expiresIn: '1y' });

    // storing the refresh token in database
    await TokenModal.create({ token: refreshToken, userId: user._id });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })

    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })
    const userDto = new UserDto(user);
    res.json({ user: userDto });

})

router.post("/api/user/login", async (req, res) => {
    const { email, pass } = req.body;
    let user;

    try {
        user = await UserModal.findOne({ email: email });
        if (!user) {
            res.json({ message: "user does not exist" });
        }
    } catch {
        res.status(500).json("Database error");
    }

    // check password
    if (user.pass !== pass) {
        return res.json({ message: "pass did not match" });
    }

    // Token
    const accessToken = jwt.sign({ _id: user._id, activated: false }, accessTokenSecret, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id, activated: false }, refreshTokenSecret, { expiresIn: '1y' });

    // storing the refresh token in database
    await TokenModal.create({ token: refreshToken, userId: user._id });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })

    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })
    const userDto = new UserDto(user);
    res.json({ user: userDto });
})

router.post("/api/user/logout", async (req, res) => {
    // get resfresh token from cookie
    const { refreshToken } = req.cookies;

    //  delete refresh token from db
    await TokenModal.remove({ token: refreshToken })

    // delete cookie
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json({ user: null, auth: false });
})

router.get("/api/user/refresh", async (req, res) => {
    // get resfresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    // check if token is valid
    let userData;
    try {
        userData = jwt.verify(refreshTokenFromCookie, refreshTokenSecret)
    } catch (err) {
        // console.log("don't match");
        return res.status(401).json({ message: "Invalid token" });
    }

    // check if token is in database
    try {
        const token = await TokenModal.findOne({
            userId: userData._id,
            token: refreshTokenFromCookie
        });
        if (!token) {
            // console.log('tokenfind');
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Error" });
    }

    // check if valid user
    const user = await userModel.findOne({ _id: userData._id });
    if (!user) {
        return res.status(404).json({ message: "No User" });
    }

    // generate new token
    const accessToken = jwt.sign({ _id: user._id, activated: false }, accessTokenSecret, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id, activated: false }, refreshTokenSecret, { expiresIn: '1y' });

    // update refresh token
    try {
        const res = await TokenModal.updateOne({ userId: userData._id }, { token: refreshToken });
    } catch (err) {
        return res.status(500).json({ message: "Internal Error" });
    }

    // put in cookie
    res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })

    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    })

    // response
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
})




// after login
router.post("/api/room", authMiddleware, async (req, res) => {
    const { roomName, roomAvatar, roomCode, members } = req.body;
    const roomData = await RoomModal.create({ roomName, roomAvatar, roomCode, members });
    // console.log(roomData);
    res.json({ room: roomData });
})

router.post("/api/chats", authMiddleware, async (req, res) => {
    const { roomId } = req.body;
    const chatData = await ChatModal.find({ room: roomId });
    // console.log(chatData);
    res.json(chatData);
})

router.get("/api/room", authMiddleware, async (req, res) => {
    const rooms = await RoomModal.find();
    res.json(rooms);
})

router.post("/api/enter-room", authMiddleware, async (req, res) => {
    const { roomCode, userName, roomName } = req.body;
    const room = await RoomModal.findOne({ roomName: roomName });
    if (room.roomCode !== roomCode) {
        res.json({ message: "code does not match" });
    } else {
        room.members.push(userName);
        room.save();
        res.json({ auth: true });
    }
})

// router.post("/api/audioUpload", upload.any(), async (req, res) => {
//     let files = req.files;
//     // console.log(files);
//     const audioPath = `${Date.now()}.${Math.round(
//         Math.random() * 1e9
//     )}our_File.mp3`;
//     fs.writeFileSync(`uploads/${audioPath}`, req.files[0].buffer);
//     res.json({ path: `uploads/${audioPath}` })
// })


module.exports = router