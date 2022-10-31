const fs = require('fs');
const path = require('path');

const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const bundleWrite = fs.createWriteStream(bundlePath);

async function createBundle() {
  const files = await fs.promises.readdir(stylesPath, { withFileTypes: true }, (err) => {
    if(err) throw err;
  });

  for(let file of files) {
    const ext = path.extname(file.name).replace(/./, '');
    if(file.isFile() && ext === 'css') {
      const stream = fs.createReadStream(path.resolve(stylesPath, file.name), 'utf-8');
      stream.pipe(bundleWrite);
    }
  }
}

createBundle()