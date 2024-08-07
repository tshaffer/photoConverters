const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';
import { checkAndCreateDirectory, getConvertibleImageFilePaths } from '../utilities';
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

export async function convertHEICFolderToJPEG(inputFolder: string, outputFolder: string): Promise<void> {
  console.log('Folder conversion invoked: ', inputFolder, outputFolder);
  await checkAndCreateDirectory(outputFolder);
  const imageFileExtensions = ['.heic', '.HEIC', '.nef', '.NEF'];
  const filesToConvert = getConvertibleImageFilePaths(imageFileExtensions, inputFolder);
  for (const inputFilePath of filesToConvert) {
    const outputFilePath: string = inputFilePath.replace(inputFolder, outputFolder).replace('.heic', '.jpg').replace('.HEIC', '.jpg').replace('.nef', '.jpg').replace('.NEF', '.jpg');
    console.log('Converting: ', inputFilePath, ' to ', outputFilePath);
    await convertHeicToJpgWithExif(inputFilePath, outputFilePath);
  }
  console.log('Folder conversion complete');
}

export const convertHeicToJpgWithExif = async (heicPath: string, jpgPath: string): Promise<void> => {

  // Step 1: Retrieve EXIF data from the HEIC file
  console.log('heicPath: ', heicPath);
  const exifData = await exiftool.read(heicPath);
  console.log('exifData: ', exifData);

  // Step 2: Convert the HEIC file to JPG
  // const inputBuffer = await promisify(fs.readFile)(heicPath);
  // console.log('readFile successful');

  // try {

  //   const outputBuffer = await convert({
  //     buffer: inputBuffer, // the HEIC file buffer
  //     format: 'JPEG',      // output format
  //     quality: 1           // the jpeg compression quality, between 0 and 1
  //   });

  //   // Step 3: Save the converted JPG
  //   await promisify(fs.writeFile)(jpgPath, outputBuffer);
  //   console.log(`Converted ${heicPath} to ${jpgPath}`);
  // } catch (error) {
  //   console.error('Error during conversion:', error);
  // } finally {
  //   // Ensure the exiftool process is properly terminated
  //   // await exiftool.end();
  //   console.log('first Finally block');
  // }
  // try {




  //   // const outputBuffer = await convert({
  //   //   buffer: inputBuffer, // the HEIC file buffer
  //   //   format: 'JPEG',      // output format
  //   //   quality: 1           // the jpeg compression quality
  //   // });

  //   // // Step 3: Save the converted JPG
  //   // await promisify(fs.writeFile)(jpgPath, outputBuffer);
  //   // console.log(`Converted ${heicPath} to ${jpgPath}`);

  //   // Step 4: Write the saved EXIF data to the JPG
  //   // await exiftool.write(jpgPath, exifData);

  console.log('try write');
  // const p = exiftool.write(jpgPath, { XPComment: "this is a test comment" })
  try {

    const p = exiftool.write(jpgPath, { Orientation: '6' })
    // const p = exiftool.write(jpgPath, { ProfileCreator: 'Apple Computer, Inc.' });
    console.log('return from write');
    await p;
    console.log('return from await');
  }
  catch (error) {
    console.error('Error during EXIF transfer:', error);
  } finally {
    console.log('second Finally block');
    // Ensure the exiftool process is properly terminated
    await exiftool.end();
  }


  //   console.log(`Copied EXIF data from ${heicPath} to ${jpgPath}`);
  // } catch (error) {
  //   console.error('Error during EXIF transfer:', error);
  // } finally {
  //   console.log('second Finally block');
  //   // Ensure the exiftool process is properly terminated
  //   await exiftool.end();
  // }
}
