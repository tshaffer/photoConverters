import * as fs from 'fs-extra';
import path from 'path';
import * as nodeDir from 'node-dir';

const imageFileExtensions = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.heic', '.HEIC', '.nef', '.NEF'];

export const fsCopyFile = async (source: string, destination: string): Promise<void> => {
  try {
    await fs.copy(source, destination);
    console.log(`File copied from ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying file from ${source} to ${destination}:`, err);
  }
}

const getFilesInDirectory = (rootDirPath: string): string[] => {
  return nodeDir.files(rootDirPath, { sync: true });
}

export const getConvertibleImageFilePaths = (convertibleImageFileExtensions: string[], rootPath: string): string[] => {
  const imageFiles: string[] = [];
  const files = getFilesInDirectory(rootPath);
  for (const file of files) {
    const extension: string = path.extname(file);
    if (convertibleImageFileExtensions.includes(extension)) {
      imageFiles.push(file);
    }
  }
  return imageFiles;
}

