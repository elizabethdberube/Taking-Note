const { application } = require('express');
const express = require('express');
//const js = require('.')
const fs = require('fs');

const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>

    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {

    res.status(200).json(`${req.method} entry received`);

    console.info(`${req.method} entry received`);
});

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} entry received`);



    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text
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
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in taking note');

    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 👍`)
);