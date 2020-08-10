const mongoose = require('mongoose');
const dbConfig = require('../db_config.json');

module.exports = () => {
    const connect = () => {
        // 배포시 삭제
        mongoose.set('debug', true);
        mongoose.connect(dbConfig.MONGO_URI, (err) => {
            if (err) console.log("몽고디비 연결 에러", err);
            else console.log("몽고디비 연결 성공");
        });
    }
    connect();

    mongoose.connection.on('errer', (err) => {
        console.log("몽고디비 연결 에러", err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log("몽고디비 연결 끊김 연결 재시도");
        connect();
    });
}