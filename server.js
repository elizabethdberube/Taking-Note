const { application } = require('express');
const express = require('express');
const js = require('.')

const fs = require('fs');


const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/')