import commandLineArgs from 'command-line-args';
import { isArray, isNil } from 'lodash';

const optionDefinitions = [
  { name: 'job', alias: 'j', type: String },
  { name: 'parameters', type: String, multiple: true },
]

const options = commandLineArgs(optionDefinitions)
console.log(options);

async function main() {
  console.log('eat more pizza');
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
