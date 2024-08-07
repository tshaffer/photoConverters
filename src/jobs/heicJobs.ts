import { convertHEICFileToJPEG, convertHEICFolderToJPEG } from '../controllers';

export const convertHeicFileToJpgJob = async (input: string, output: string) => {
  console.log('convertHeicFileToJpgJob invoked', input, output);
  await convertHEICFileToJPEG(input, output);
  console.log('convertHeicFileToJpgJob completed');
}

export const convertHeicFolderToJpgJob = async (input: string, output: string) => {
  console.log('convertHeicFolderToJpgJob invoked', input, output);
  await convertHEICFolderToJPEG(input, output);
  console.log('convertHeicFolderToJpgJob completed');
}
