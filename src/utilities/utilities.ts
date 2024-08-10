import { execFileSync } from "child_process";

export const copyExifTags = async (sourceFile: string, targetFile: string, deleteOrientation: boolean) => {
  try {
    const copyOutput = execFileSync('exiftool', ['-TagsFromFile', sourceFile, targetFile]);
    console.log(`stdout: ${copyOutput.toString()}`);

    if (deleteOrientation) {
      const deleteTagOutput = execFileSync('exiftool', ['-Orientation=', targetFile]);
      console.log(`stdout: ${deleteTagOutput.toString()}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stderr) {
      console.error(`stderr: ${error.stderr.toString()}`);
    }
  }
}
