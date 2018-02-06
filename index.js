const express = require('express')
const app = express()

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'))

app.listen(3030, () => console.log('Example app listening on port 3030!'))