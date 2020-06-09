import express from 'express';
const app = express();
const port = process.env.port || 4000;

app.get('/', (req, res) => res.send('Hello World'));
app.listen(4000, () => console.log(`Server running at http://localhost:${port}`));