require('util');
import { copyExifTags, getConvertibleImageFilePaths } from '../utilities';
require('exiftool-vendored');

const gm = require('gm').subClass({ imageMagick: true });

export async function convertNEFFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('convertNEFFolderToJPEG invoked: ', inputFolder, outputFolder);
  const imageFileExtensions = ['.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.nef', '.jpg').replace('.NEF', '.jpg');
    await convertNEFFileToJPEGWithEXIF(inputFilePath, outputFilePath);
  }
  console.log('convertNEFFolderToJPEG complete');
}

export async function convertNEFFileToJPEGWithEXIF(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {
    console.log(`convertNEFFileToJPEGWithEXIF: ${inputFilePath} to ${outputFilePath}`);
    await convertNEFFileToJPEG(inputFilePath, outputFilePath);
    copyExifTags(inputFilePath, outputFilePath);
  }
  catch (error) {
    console.error('Error in convertNEFFileToJPEGWithEXIF:', error);
  }
}

export async function convertNEFFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .write(outputFilePath, (err: any) => {
        if (err) {
          console.error('Error in convertNEFFileToJPEG:', err);
          return reject(err);
        }
        else {
          return resolve();
        }
      });
  });
}
