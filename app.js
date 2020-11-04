/**
 * To-Do Application Server
 * Author: Sung Hwa, Park
 */
const express = require('express');
const path = require('path');
const app = express();

// Static 데이터들을 사용하기 위해
app.use('/', express.static(__dirname + '/public'));

// Index Page 진입을 위한 GET 요청 처리 (RequestMapping = "/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/favicon.ico', (req, res) => res.status(204));

// To-Do Application Server Start
app.listen(3000, function() {
    console.log('>> To-Do Application Server Started, Port : 3000');
});