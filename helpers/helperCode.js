const fs = require('fs');


const writeAFile = (destination, content) =>

    fs.writeFile(destination, JSON.stringify(content, null, 4),
        (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Note saved!')

    );


const readThenAppend = (content, file) =>
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {

            const parsedNote = JSON.parse(data);
            parsedNote.push(content);
            writeAFile(file, parsedNote);
        }
    });

module.exports = { readThenAppend, writeAFile };