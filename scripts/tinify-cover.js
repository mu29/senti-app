/* eslint-disable */
// @ts-ignore
const tinify = require('tinify');
const fs = require('fs');
const path = require('path');

tinify.key = 'nBOpq1cyCZDwDPjZVTfUGphdaVe5NxH8';

const tinifyAsset = async (folder, file) => {
  if (!file.includes('.jpg') && !file.includes('.jpeg')) {
    return;
  }

  const path = `${folder}/${file}`;

  console.info(`tinify ${path}`);

  await tinify
    .fromFile(path)
    .resize({
      method: 'thumb',
      width: 540,
      height: 720,
    })
    .toFile(path);
}

const folder = process.argv[2];
const files = fs.readdirSync(folder);

files.forEach(async (file) => {
  await tinifyAsset(folder, file);
});
