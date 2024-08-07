import { convertHEICFileToJPEG, convertHEICFolderToJPEG, convertHeicToJpgWithExif } from '../controllers';

export const convertHeicFileToJpgJob = async (input: string, output: string) => {
  console.log('convertHeicFileToJpgJob invoked', input, output);
  await convertHeicToJpgWithExif(input, output);
  console.log('convertHeicFileToJpgJob completed');
}

export const convertHeicFolderToJpgJob = async (input: string, output: string) => {
  console.log('convertHeicFolderToJpgJob invoked', input, output);
  await convertHEICFolderToJPEG(input, output);
  console.log('convertHeicFolderToJpgJob completed');
}
