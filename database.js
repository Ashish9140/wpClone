const mongoose = require('mongoose');

function DBConnect() {
    mongoose.connect('mongodb+srv://ashish:pjyYTFcxuJMABAhf@cluster0.xx48i.mongodb.net/?retryWrites=true&w=majority');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected...');
    });
}

module.exports = DBConnect;