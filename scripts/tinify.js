/* eslint-disable */

const tinify = require('tinify');
const fs = require('fs');
const path = require('path');

tinify.key = 'Rj4V2CbknwPR6xNJ6y7FC5XrjY9bx6Yz';

const folders = [
  'drawable-hdpi',
  'drawable-mdpi',
  'drawable-xhdpi',
  'drawable-xxhdpi',
  'drawable-xxxhdpi',
];

const tinifyAsset = async (folder, file) => {
  if (!file.includes('.png')) {
    return;
  }

  console.info(`tinify ${folder}/${file}`);

  const path = `${process.argv[2]}/${folder}/${file}`;
  await tinify.fromFile(path).toFile(path);
}

const copyAsset = (folder, file) => {
  const fileName = file.replace('.png', '').replace('-', '_');

  console.info(`copy ${folder}/${file} to android / ios assets folder`);

  // android
  const src = `${process.argv[2]}/${folder}/${file}`;
  const dest = path.join(__dirname, `../android/app/src/main/res/${folder}/${file.replace('-', '_')}`);
  fs.copyFileSync(src, dest);

  // ios
  const imageSetDir = path.join(__dirname, `../ios/About/Images.xcassets/${fileName}.imageset`)

  // imageset 폴더 생성
  if (!fs.existsSync(imageSetDir)) {
    console.info(`create ${file} imageset folder`);

    fs.mkdirSync(imageSetDir);
    fs.writeFileSync(
      `${imageSetDir}/Contents.json`,`{
  "images" : [
    {
      "idiom" : "universal",
      "filename" : "${fileName}.png",
      "scale" : "1x"
    },
    {
      "idiom" : "universal",
      "filename" : "${fileName}@2x.png",
      "scale" : "2x"
    },
    {
      "idiom" : "universal",
      "filename" : "${fileName}@3x.png",
      "scale" : "3x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}`);
  }

  switch (folder) {
    case 'drawable-mdpi':
      fs.copyFileSync(src, `${imageSetDir}/${fileName}.png`);
      break;
    case 'drawable-xhdpi':
      fs.copyFileSync(src, `${imageSetDir}/${fileName}@2x.png`);
      break;
    case 'drawable-xxhdpi':
      fs.copyFileSync(src, `${imageSetDir}/${fileName}@3x.png`);
      break;
  }
}

if (process.argv[2].includes('android/app/src/main/res')) {
  console.error('tinify는 한번만 해주세요 ~.<');
  return;
}

folders.forEach((folder) => {
  const targetFolder = `${process.argv[2]}/${folder}`;
  const files = fs.readdirSync(targetFolder);
  files.forEach(async (file) => {
    await tinifyAsset(folder, file);
    copyAsset(folder, file);
  })
})
