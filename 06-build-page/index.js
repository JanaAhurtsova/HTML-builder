const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'style.css');
const bundleWrite = fs.createWriteStream(bundlePath);
const assets = path.resolve(__dirname, 'assets');
const destAssets = path.resolve(__dirname, 'project-dist/assets');

async function createDistHtml() {
  await fsPromises.mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });

  let template = await fsPromises.readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
  const components = await fsPromises.readdir(path.resolve(__dirname, 'components'), { withFileTypes: true });
  const templateName = template.match(/{{[A-Za-z]+}}/g);

  for(let component of components) {
    const ext = path.extname(component.name).replace(/./, '');

    if(ext === 'html') {
      const data = await fsPromises.readFile(path.resolve(__dirname, 'components', component.name), { encoding: 'utf-8' });
      const componentName = path.parse(path.resolve(__dirname, 'components', component.name)).name;

      for(let i = 0; i < templateName.length; i++) {
        if(templateName[i].replace(/[{}]/g, '') === componentName) {
          template = template.replace(templateName[i], data);
        }
      }

    }

  }

  await fsPromises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), template)
}

async function createStyles() {
  const files = await fsPromises.readdir(stylesPath, { withFileTypes: true }, (err) => {
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

async function copyFolder(src, dest) {
  const files = await fsPromises.readdir(src, { withFileTypes: true }, (err) => {
    if(err) throw err;
  });

  await fsPromises.rm(dest, { recursive: true, force: true }, (err) => {
    if(err) throw err;
  });

  await fsPromises.mkdir(dest, { recursive: true }, (err) => {
    if(err) throw err;
  });

  for (let file of files) {
    const srcFilePath = path.resolve(src, file.name);
    const destFilePath = path.resolve(dest, file.name);

    if (file.isDirectory()) {
      await copyFolder(srcFilePath, destFilePath);
    } else {
      await fsPromises.copyFile(srcFilePath, destFilePath);
    }
  }
}

createDistHtml();
createStyles();
copyFolder(assets, destAssets);