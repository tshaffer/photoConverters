require('util');
import { getConvertibleImageFilePaths } from '../utilities';
import { writeTags } from './heicConverters';
const { exiftool } = require('exiftool-vendored');

const sharp = require('sharp');
const fs = require('fs-extra');

const gm = require('gm').subClass({ imageMagick: true });

const readOnlyTags: string[] = [
  'errors',
  'SourceFile',
  'JpgFromRawStart',
  'JpgFromRawLength',
  'StripOffsets',
  'StripByteCounts',
  'PreviewImageStart',
  'PreviewImageLength',
  'XMP-exif:FlashMode',
  'XMP-exif:FlashMode',
  'ExifIFD:LightSource',
  'XMP-aux:LensID',
  'ExifToolVersion',
  'FileSize',
  'FileAccessDate',
  'FileInodeChangeDate',
  'FileType',
  'FileTypeExtension',
  'MIMEType',
  'ShotInfoVersion',
  'LensDataVersion',
  'FlashInfoVersion',
  'TIFF-EPStandardID',
  'Aperture',
  'Megapixels',
  'ScaleFactor35efl',
  'ShutterSpeed',
  'ThumbnailTIFF',
  'CircleOfConfusion',
  'DOF',
  'FOV',
  'FocalLength35efl',
  'HyperfocalDistance',
  'LightValue',
];

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
          console.log(`Converted ${inputFilePath} to JPEG`);
          return resolve();
        }
      });
  });
}


export async function convertNEFFileToJPEGWithEXIF(inputFilePath: string, outputFilePath: string): Promise<void> {

  convertNEFFileToJPEG(inputFilePath, outputFilePath);
  return;
  
  convertWithExif(inputFilePath, outputFilePath);
  return;

  try {

    // Step 1: Retrieve EXIF data from the HEIC file
    const exifData = await exiftool.read(inputFilePath);

    // Step 3: Convert and save the converted file
    await convertNEFFileToJPEG(inputFilePath, outputFilePath);

    // Step 4: Write the saved EXIF data to the JPG
    await writeTags(outputFilePath, exifData);
  }
  catch (error) {
    console.error('Error in convertHeicToJpgWithExif:', error);
  }
}


// async function convertWithExif(nefPath: string, jpgPath: string) {
//   try {
//     // Extract EXIF data
//     const exifData = await exiftool.read(nefPath);

//     // Convert NEF to JPG using sharp
//     await sharp(nefPath)
//       .toFormat('jpeg')
//       .toFile(jpgPath);

//     // Reapply EXIF data to the new JPEG
//     await exiftool.write(jpgPath, exifData);

//     console.log(`Converted ${nefPath} to ${jpgPath} with EXIF data preserved.`);
//   } catch (error) {
//     console.error('Error during conversion:', error);
//   } finally {
//     await exiftool.end();
//   }
// }

// const { exiftool } = require('exiftool-vendored');
// const sharp = require('sharp');
// const fs = require('fs-extra');

/*
rror during conversion: Error: Warning: Tag 'SourceFile' is not defined
Warning: Tag 'errors' is not defined
'ExifToolVersion',
'FileSize',
'FileAccessDate',
'FileInodeChangeDate',
'FileType',
'FileTypeExtension',
'MIMEType',

'JpgFromRawStart',
'JpgFromRawLength',
'StripOffsets',
'StripByteCounts',
'PreviewImageStart',
'PreviewImageLength',

Warning: Can't convert XMP-exif:FlashMode (not in PrintConv)
Warning: Can't convert ExifIFD:LightSource (not in PrintConv)
Warning: Expected one or more integer values in XMP-aux:LensID (ValueConvInv)
'ShotInfoVersion',
'LensDataVersion',
'FlashInfoVersion',
'TIFF-EPStandardID',
'Aperture',
'Megapixels',
'ScaleFactor35efl',
'ShutterSpeed',
'ThumbnailTIFF',
'CircleOfConfusion',
'DOF',
'FOV',
'FocalLength35efl',
'HyperfocalDistance',
'LightValue',
*/

const isWritableTag = (tag: string): boolean => {
  if (readOnlyTags.includes(tag)) {
    return false;
  }
  if (tag.includes('XMP')) {
    console.log(tag);
    return false;
  }
  if (tag.includes('FlashMode')) {
    console.log(tag);
    return false;
  }
  if (tag.includes('Lens')) {
    console.log(tag);
    return false;
  }
  if (tag.includes('LightSource')) {
    console.log(tag);
    return false;
  }
  return true;
}

async function convertWithExif(nefPath: string, jpgPath: string) {
  try {
    // Check if the output file already exists, and remove it if it does
    if (fs.existsSync(jpgPath)) {
      await fs.remove(jpgPath);
    }

    // Extract EXIF data
    const exifData = await exiftool.read(nefPath);

    // Filter out non-writable tags
    const writableTags: any = {};
    for (const [key, value] of Object.entries(exifData)) {
      if (await isWritableTag(key)) {
        writableTags[key] = value;
      }
    }

    // Convert NEF to JPG using sharp
    await sharp(nefPath)
      .toFormat('jpeg')
      .toFile(jpgPath);

    // Write the filtered EXIF data to the new JPEG
    await exiftool.write(jpgPath, writableTags);

    console.log(`Converted ${nefPath} to ${jpgPath} with EXIF data preserved.`);
  } catch (error) {
    console.error('Error during conversion:', error);
  } finally {
    await exiftool.end();
  }
}
