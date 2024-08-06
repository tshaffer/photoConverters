const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';

export const convertHeicToJpgJob = async (input: string, output: string) => {
  console.log('convertHeicToJpgJob', input, output);
  return;
  convertHEICFileToJPEG(input, output);
}

async function convertHEICFileToJPEG(input: string, output: string): Promise<void> {

  const inputBuffer = await promisify(fs.readFile)(input);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG',      // output format
    quality: 1           // the jpeg compression quality, between 0 and 1
  });

  await promisify(fs.writeFile)(output, outputBuffer);
}
