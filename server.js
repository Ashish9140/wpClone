require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const DBConnect = require('./database');
const Socket = require('./socket');
const router = require('./routes');
const multer = require('multer');
const cookieParser = require('cookie-parser');


// const cors = require('cors');
// const corsOption = {
//     credentials: true,
//     origin: ['http://localhost:3000'],
// };
// app.use(cors(corsOption));

app.use(cookieParser());
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/storage', express.static('storage'));
app.use(router);


// Database connection
DBConnect();


// working on multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`)
//     }
// })
// const upload = multer({ storage: storage }).single("file");
// app.post("/api/upload/file", async (req, res) => {
//     upload(req, res, err => {
//         if (err) {
//             return res.json({ messages: "uploading error" });
//         } else {
//             return res.json({ messages: "uploaded", url: res.req.file.path });
//         }
//     })
// })


// socket connection
// const io = require('socket.io')(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//     },
// });


const io = require('socket.io')(server);
Socket(io);


// connecting port 
const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV === 'production') {
app.use(express.static("frontend/build"));
// }

server.listen(PORT, () => {
    console.log("Server is active");
})