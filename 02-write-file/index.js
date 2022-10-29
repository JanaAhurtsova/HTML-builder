const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const file = path.resolve(__dirname, 'text.txt');
const writableToFile = fs.createWriteStream(file, 'utf-8');

const message = {
  greeting: 'Hi! Enter any text\n',
  parting: 'I was glad to see you! Bye!'
}

//create file
fs.open(file, 'w', (err) => {
  if(err) throw err;
});

stdout.write(message.greeting);

stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    close();
  }
  writableToFile.write(data);
})

const close = () => {
  stdout.write(message.parting);
  process.exit();
}

process.on("SIGINT", close);