const fs = require('fs').promises;
const path = require('path');
const src = path.resolve(__dirname, 'files');
const dest = path.resolve(__dirname, 'filesCopy');

async function copyFolder(src, dest) {
  const files = await fs.readdir(src, { withFileTypes: true }, (err) => {
    if(err) throw err;
  });

  await fs.rm(dest, { recursive: true, force: true }, (err) => { if(err) throw err});

  await fs.mkdir(dest, { recursive: true }, (err) => { if(err) throw err});

  for (let file of files) {
    const srcFilePath = path.resolve(src, file.name);
    const destFilePath = path.resolve(dest, file.name);

    if (file.isDirectory()) {
      await copyFolder(srcFilePath, destFilePath);
    } else {
      await fs.copyFile(srcFilePath, destFilePath);
    }
  }
}
copyFolder(src, dest)