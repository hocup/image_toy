const express = require('express');
const app = express();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// app.get('/', (req, res) => res.send('Hello World!'))


app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    console.log("UPLOADEDEDNESS", req.file);
    res.redirect('/index.html?file='+req.filename);
});

app.listen(3030, () => console.log('Example app listening on port 3030!'))