require('util');
import { getConvertibleImageFilePaths } from '../utilities';

const gm = require('gm').subClass({ imageMagick: true });

export async function convertNEFFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  gm(inputFilePath)
    .write(outputFilePath, (err: any) => {
      if (err) throw err;
      console.log(`Converted ${inputFilePath} to JPEG`);
    });
}

export async function convertNEFFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('convertNEFFolderToJPEG invoked: ', inputFolder, outputFolder);
  const imageFileExtensions = ['.heic', '.HEIC', '.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.heic', '.jpg').replace('.HEIC', '.jpg').replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertNEFFileToJPEG(inputFilePath, outputFilePath);
  }
  console.log('convertNEFFolderToJPEG complete');
}

