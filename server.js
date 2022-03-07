const { application } = require('express');
const express = require('express');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require("uuid");
const path = require('path');
const id = uuidv4();

const app = express();

const PORT = 3001;

const readFromFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) =>

    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

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

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} entry received`);

    const { title, note } = req.body;

    if (title && note) {

        const newNote = {
            title,
            note,
            id,
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Note saved!')

                );
            }
        });

        const response = {
            status: 'success',
            body: newNote
        };

        console.log(response);
        res.status(200).json(response);
    } else {
        res.status(500).json('Error in taking note');

    }
});

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

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

// app.put('/api/notes', (req, res) => {
//     if (req.body) {

//         const newNote = {
//             title,
//             note,
//             id,
//         };
//         fs.readFile('./db/db.json', 'utf8', (err, data) => {
//             if (err) {
//                 console.error(err);
//             } else {

//                 const parsedNote = JSON.parse(data);
//                 parsedNote.push(newNote);
//                 fs.writeFile('./db/db.json', JSON.stringify(outcome, null, 4),
//                     (writeErr) =>
//                         writeErr ? console.error(writeErr) : console.info('New array!'))
//                 res.join(`New array`);

//             }
//         });
//     }
// });

app.get('*', (req, res) =>

    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 👍`)
);