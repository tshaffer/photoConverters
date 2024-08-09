require('util');
import { getConvertibleImageFilePaths } from '../utilities';
import { writeTags } from './heicConverters';
const { exiftool } = require('exiftool-vendored');

const gm = require('gm').subClass({ imageMagick: true });

export async function convertNEFFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('convertNEFFolderToJPEG invoked: ', inputFolder, outputFolder);
  const imageFileExtensions = ['.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertNEFFileToJPEGWithEXIF(inputFilePath, outputFilePath);
  }
  console.log('convertNEFFolderToJPEG complete');
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
          // console.log(`Converted ${inputFilePath} to JPEG`);
          return resolve();
        }
      });
  });
}


export async function convertNEFFileToJPEGWithEXIF(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {

    // Step 1: Retrieve EXIF data from the HEIC file
    // const exifData = await exiftool.read(inputFilePath);

    // Step 3: Convert and save the converted file
    await convertNEFFileToJPEG(inputFilePath, outputFilePath);
    console.log(`exiftool -TagsFromFile "${inputFilePath}" "${outputFilePath}"`);

    // Step 4: Write the saved EXIF data to the JPG
    // await writeTags(outputFilePath, exifData);
  }
  catch (error) {
    console.error('Error in convertHeicToJpgWithExif:', error);
  }
}

