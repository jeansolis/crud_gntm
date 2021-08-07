import express from 'express';

const app = express();
const port = 3000;
app.get('/', (_, res) => {
  res.send('done');
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
