const { application } = require('express');
const express = require('express');
//const app = require('express').Router();
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require("uuid");
const path = require('path');
const { readThenAppend, writeAFile, } = require('./helpers/helperCode');

const app = express();

const PORT = 3001;

const readFromFile = util.promisify(fs.readFile);

//so express can handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static middleware
app.use(express.static('public'));

//get route for hompage
app.get('/notes', (req, res) =>

    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//get route for notes page
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.status(200).json(data);
            console.log(data);
        }
    });
});

//route for saving notes
app.post('/api/notes', (req, res) => {

    console.info(`${req.method} entry received`);

    const { title, note } = req.body;

    if (title && note) {

        const newNote = {
            title,
            note,
            id: uuidv4(),
        };


        readThenAppend(newNote, './db/db.json');
        res.json('Note save!');
    } else {
        res.error('Error saving note');
    }

});


//retrieving all the notes
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//get route for spefic note by id
app.get('/api/notes/:id', (req, res) => {
    const uniqId = req.params.id
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const outcome = json.filter((note) => note.id == uniqId);
            return outcome.length > 0
                ? res.json(outcome)
                : res.json('No id');
        });
});

//get route for deleting note by id
app.delete('/api/notes/:id', (req, res) => {
    const uniqId = req.params.id
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const outcome = json.filter((note) => note.id !== uniqId);
            fs.writeFile('./db/db.json', JSON.stringify(outcome, null, 4),
                (writeErr) =>
                    writeErr ? console.error(writeErr) : console.info('Note has been deleted`'))
            res.status(200).json("Note has been deleted");
        });
});

//wildcard directs user to home
app.get('*', (req, res) =>

    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
    console.log(`App listening at http://localhost:${PORT} 👍`);
});
