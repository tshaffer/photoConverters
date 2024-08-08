const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';
import { checkAndCreateDirectory, getConvertibleImageFilePaths } from '../utilities';
import { convertCreateDateToISO } from '../utilities/uilities';
const { exiftool } = require('exiftool-vendored');

export async function convertHEICFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  const inputBuffer = await promisify(fs.readFile)(inputFilePath);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG',      // output format
    quality: 1           // the jpeg compression quality, between 0 and 1
  });
  await promisify(fs.writeFile)(outputFilePath, outputBuffer);
}

export async function convertHEICFolderToJPEGWithEXIF(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('Folder conversion invoked: ', inputFolder, outputFolder);
  await checkAndCreateDirectory(outputFolder);
  const imageFileExtensions = ['.heic', '.HEIC', '.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.heic', '.jpg').replace('.HEIC', '.jpg').replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertHEICFileToJPEGWithEXIF(inputFilePath, outputFilePath);
  }
  // Ensure the exiftool process is properly terminated
  await exiftool.end();
  console.log('Folder conversion complete');
}

export const convertHEICFileToJPEGWithEXIF = async (heicPath: string, jpgPath: string): Promise<void> => {
  try {
    // Step 1: Retrieve EXIF data from the HEIC file
    console.log('heicPath: ', heicPath);
    const exifData = await exiftool.read(heicPath);
    console.log('exifData: ', exifData);

    // Step 2: Convert the HEIC file to JPG
    const inputBuffer = await promisify(fs.readFile)(heicPath);
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG',      // output format
      quality: 1           // the jpeg compression quality, between 0 and 1
    });

    // Step 3: Save the converted JPG
    await promisify(fs.writeFile)(jpgPath, outputBuffer);
    console.log(`Converted ${heicPath} to ${jpgPath}`);

    // Step 4: Write the saved EXIF data to the JPG
    await writeTags(jpgPath, exifData);
  }
  catch (error) {
    console.error('Error in convertHeicToJpgWithExif:', error);
  } finally {
    console.log('convertHeicToJpgWithExif complete');
  }
}

export const writeTags = async (filePath: string, exifData: any): Promise<void> => {
  try {
    const isoDate: string = await convertCreateDateToISO(exifData);
    console.log('isoDate: ', isoDate);
    await exiftool.write(filePath, { AllDates: isoDate })
    await exiftool.write(filePath, { SubSecTimeDigitized: isoDate })
    await exiftool.write(filePath, { SubSecTimeOriginal: isoDate })
    await exiftool.write(filePath, { SubSecModifyDate: isoDate })
  } catch (error) {
    console.error('Error during EXIF transfer:', error);
  }
}

