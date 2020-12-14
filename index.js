const core = require('@actions/core');
const github = require('@actions/github');
const dotenv = require('dotenv');
const fs = require('fs');

try {
  const nvmrc = fs.readFileSync('.nvmrc', 'utf-8');
  if (nvmrc) core.setOutput('NODE_VERSION', nvmrc);

  const { eventName, ref } = github.context;
  const refToEnv = {
    master: 'prod',
    main: 'prod',
    qa: 'qa',
    stage: 'stage',
    staging: 'stage',
    dev: 'dev',
    develop: 'dev',
  };
  const env = eventName === 'release' ? 'prod' : refToEnv[ref];
  if (!env) throw new Error('Could not find a suitable env for github.ref', ref);

  core.debug(`Copying .env.${env} --> .env`);
  fs.copyFileSync(`.env.${env}`, '.env');

  const envFile = path.resolve(__dirname, '.env');
  const dotEnvConfig = dotenv.config({ path: envFile });
  if (dotEnvConfig.error) throw dotEnvConfig.error;
  const parsedEnvFile = dotEnvConfig.parsed;
  Object.entries(parsedEnvFile).forEach(([key, val]) => {
    core.setOutput(key, val);
  });
} catch (error) {
  core.setFailed(error.message);
}
