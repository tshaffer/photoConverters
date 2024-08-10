const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';
import { checkAndCreateDirectory, getConvertibleImageFilePaths } from '../utilities';
import { copyExifTags } from '../utilities/uilities';
const { exiftool } = require('exiftool-vendored');

export async function convertHEICFolderToJPEGWithEXIF(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('Folder conversion invoked: ', inputFolder, outputFolder);
  await checkAndCreateDirectory(outputFolder);
  const imageFileExtensions = ['.heic', '.HEIC'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.heic', '.jpg').replace('.HEIC', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertHEICFileToJPEGWithEXIF(inputFilePath, outputFilePath);
  }
  // Ensure the exiftool process is properly terminated
  await exiftool.end();
  console.log('Folder conversion complete');
}

export const convertHEICFileToJPEGWithEXIF = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
  try {
    console.log(`convertHEICFileToJPEGWithEXIF: ${inputFilePath} to ${outputFilePath}`);
    await convertHEICFileToJPEG(inputFilePath, outputFilePath);
    copyExifTags(inputFilePath, outputFilePath);
  }
  catch (error) {
    console.error('Error in convertHEICFileToJPEGWithEXIF:', error);
  }
}

export async function convertHEICFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  const inputBuffer = await promisify(fs.readFile)(inputFilePath);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG',      // output format
    quality: 1           // the jpeg compression quality, between 0 and 1
  });
  await promisify(fs.writeFile)(outputFilePath, outputBuffer);
}

