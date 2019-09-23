// @ts-ignore
const tinify = require('tinify');
const fs = require('fs');

tinify.key = 'HVGFd85LnDnk5sgBX7pbzWQS64NW6mg1';

const folder = process.argv[2];
const files = fs.readdirSync(folder);
const targetFolder = `${folder}-tinify`;

const tinifyAsset = async (dir, file) => {
  if (!file.includes('.jpg') || file.includes('-tiny')) {
    return;
  }

  const path = `${dir}/${file}`;
  const targetFile = `${file.replace('.jpg', '')}-tiny.jpg`;

  console.log(targetFile);

  await tinify
    .fromFile(path)
    .resize({
      method: 'thumb',
      width: 1440,
      height: 1920,
    })
    .toFile(`${targetFolder}/${targetFile}`);
};

if (!fs.existsSync(targetFolder)){
  fs.mkdirSync(targetFolder);
}

files.forEach(async (file) => {
  await tinifyAsset(folder, file);
});
