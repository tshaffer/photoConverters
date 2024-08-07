import { convertNEFFileToJPEG, convertNEFFolderToJPEG } from '../controllers';

export const convertNefFileToJpgJob = async (input: string, output: string) => {
  console.log('convertNefFileToJpgJob invoked', input, output);
  await convertNEFFileToJPEG(input, output);
  console.log('convertNefFileToJpgJob completed');
}

export const convertNefFolderToJpgJob = async (input: string, output: string) => {
  console.log('convertNefFolderToJpgJob invoked', input, output);
  await convertNEFFolderToJPEG(input, output);
  console.log('convertNefFolderToJpgJob completed');
}
