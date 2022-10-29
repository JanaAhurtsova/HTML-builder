const fs = require('fs');
const path = require('path');
const folderPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if(err) throw err;
  files.forEach(file => {
    if(file.isFile()) {
      const filePath = path.resolve(__dirname, 'secret-folder', file.name);
      const fileName = path.parse(filePath).name;
      const ext = path.extname(file.name).replace(/./, '');
      fs.stat(filePath, (err, item) => {
        if(err) throw err;
        console.log(`${fileName}-${ext}-${item.size/1024}kb`)
      })
    }
  })
})