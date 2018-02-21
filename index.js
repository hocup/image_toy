#!/usr/bin/env node

const express = require('express');
const app = express();
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })

// app.get('/', (req, res) => res.send('Hello World!'))


app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    console.log("UPLOADEDED FILE DATA", req.file, req.body);
    let redirectUrl = "./generate.html?file=" + req.file.filename;

    let allowedParams = ["num_triangles", "num_workers", "pop_size", "sample_size", "num_generations", "mutation_rate", "blur", ];

    allowedParams.forEach(
        (p) => {
            if(req.body[p]) {
                redirectUrl += "&" + p + "=" + req.body[p];
            }
        }
    )

    // if(req.body.num_triangles) {
    //     redirectUrl += "&num_triangles=" + req.body.num_triangles; 
    // }
    // if(req.body.num_workers) {
    //     redirectUrl += "&num_workers=" + req.body.num_workers;
    // }
    res.redirect(redirectUrl);
});

app.listen(3030, () => console.log('Example app listening on port 3030!'))