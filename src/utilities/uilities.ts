import { execFileSync } from "child_process";

export const copyExifTags = (sourceFile: string, targetFile: string) => {
  try {
    const output = execFileSync('exiftool', ['-TagsFromFile', sourceFile, targetFile]);
    console.log(`stdout: ${output.toString()}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stderr) {
      console.error(`stderr: ${error.stderr.toString()}`);
    }
  }
}
