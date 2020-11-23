const express = require('express');
const mongoose = require('mongoose');
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';

console.log(process.env.NODE_ENV);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

// Set up Mongoose and connect to DB
// mongoose.set('useFindAndModify', false);
// const db = mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.010pa.mongodb.net/${dbName}?retryWrites=true&w=majority`).catch(e => {
//     console.log(e);
// });
// mongoose.Promise = global.Promise;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world');
});

module.exports = app;
