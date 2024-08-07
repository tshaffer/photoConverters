const { promisify } = require('util');
const fs = require('fs');
// import convert from 'heic-convert';
import { checkAndCreateDirectory, getConvertibleImageFilePaths } from '../utilities';
import convert from 'heic-jpg-exif';

export async function convertHEICFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {

  console.log('File conversion invoked: ', inputFilePath, outputFilePath);
  try {
    await convert(inputFilePath, outputFilePath, 1);
  } catch (error) {
    console.error('Error converting file: ', error);
  }

  // const inputBuffer = await promisify(fs.readFile)(inputFilePath);
  // const outputBuffer = await convert({
  //   buffer: inputBuffer, // the HEIC file buffer
  //   format: 'JPEG',      // output format
  //   quality: 1           // the jpeg compression quality, between 0 and 1
  // });

  // await promisify(fs.writeFile)(outputFilePath, outputBuffer);
}

export async function convertHEICFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('Folder conversion invoked: ', inputFolder, outputFolder);
  await checkAndCreateDirectory(outputFolder);
  const imageFileExtensions = ['.heic', '.HEIC', '.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.heic', '.jpg').replace('.HEIC', '.jpg').replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertHEICFileToJPEG(inputFilePath, outputFilePath);
  }
  console.log('Folder conversion complete');
}
