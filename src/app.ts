import commandLineArgs from 'command-line-args';
import { isArray, isNil } from 'lodash';

import { Jobs } from './types';
import { convertHeicToJpgJob } from './jobs';

const optionDefinitions = [
  { name: 'job', alias: 'j', type: String },
  { name: 'parameters', type: String, multiple: true },
]

const options = commandLineArgs(optionDefinitions)
console.log(options);

async function main() {

  console.log('eat more pizza');

  const { job, parameters } = getCommandLineArguments(options);

  switch (options.job) {
    case Jobs.ConvertHeicToJpg:
      console.log('ConvertHeicToJpg');
      if (parameters.length !== 2) {
        debugger;
      }
      await convertHeicToJpgJob(parameters[0], parameters[1]);
      break;
  }

}


const getCommandLineArguments = (options: any) => {
  if (isNil(options.job)) {
    debugger;
  }
  const parameters: string[] = [];
  if (isArray(options.parameters)) {
    for (const parameter of options.parameters) {
      parameters.push(parameter);
    }
  }

  return {
    job: options.job,
    parameters
  };
}

main();
