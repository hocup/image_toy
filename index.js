#!/usr/bin/env node

const express = require('express');
const app = express();
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })

const rootPath = process.env.IMAGE_TOY_ROOT_PATH ? process.env.IMAGE_TOY_ROOT_PATH : "";

app.use(rootPath, express.static('public'));

app.post(rootPath + '/upload', upload.single('file'), (req, res) => {
    console.log("UPLOADEDED FILE DATA", req.file, req.body);
    let redirectUrl = "./generate.html?file=" + req.file.filename;

    let allowedParams = [
        "num_triangles", 
        "num_workers", 
        "pop_size", 
        "sample_size", 
        "num_generations", 
        "mutation_rate", 
        "blur", 
    ];

    allowedParams.forEach(
        (p) => {
            if(req.body[p]) {
                redirectUrl += "&" + p + "=" + req.body[p];
            }
        }
    )

    res.redirect(redirectUrl);
});

app.listen(3030, () => console.log('Example app listening on port 3030!'))