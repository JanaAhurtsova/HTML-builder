const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

readableStream.on('data', (data, err) => {
  if(err) throw new Error(err);
  console.log(data);
})
