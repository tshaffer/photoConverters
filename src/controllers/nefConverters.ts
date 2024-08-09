require('util');
import { promisify } from 'util';
import { getConvertibleImageFilePaths } from '../utilities';
const { exiftool } = require('exiftool-vendored');

const gm = require('gm').subClass({ imageMagick: true });

export async function convertNEFFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .write(outputFilePath, (err: any) => {
        if (err) {
          console.error('Error in convertNEFFileToJPEG:', err);
          return reject(err);
        }
        else {
          console.log(`Converted ${inputFilePath} to JPEG`);
          return resolve();
        }
      });
  });

  // console.log('invoke gm');
  // const writer = gm(inputFilePath);
  // console.log('return from gm invocation');
  // await promisify(writer.write(outputFilePath));
  // console.log('return from write');
  // return Promise.resolve();

// gm(inputFilePath)
//   .write(outputFilePath, (err: any) => {
//     if (err) throw err;
//     console.log(`Converted ${inputFilePath} to JPEG`);
//   });
}


export async function convertNEFFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('convertNEFFolderToJPEG invoked: ', inputFolder, outputFolder);
  const imageFileExtensions = ['.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertNEFFileToJPEG(inputFilePath, outputFilePath);
  }
  console.log('convertNEFFolderToJPEG complete');
}

export async function convertNEFFileToJPEGWithEXIF(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {
    // Step 1: Retrieve EXIF data from the HEIC file
    console.log('path to nef: ', inputFilePath);
    const exifData = await exiftool.read(inputFilePath);
    console.log('return from exiftool.read');
    // console.log('exifData: ', exifData);
  }
  catch (error) {
    console.error('Error in convertHeicToJpgWithExif:', error);
  }

  console.log('invoke convertNEFFileToJPEG');
  await convertNEFFileToJPEG(inputFilePath, outputFilePath);
  console.log('return from convertNEFFileToJPEG');

  // gm(inputFilePath)
  //   .write(outputFilePath, (err: any) => {
  //     if (err) throw err;
  //     console.log(`Converted ${inputFilePath} to JPEG`);
  //   });
}

