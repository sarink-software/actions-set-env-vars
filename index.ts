// Import modules with "* as" https://github.com/vercel/ncc/issues/621
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

try {
  type Env = 'prod' | 'qa' | 'stage' | 'dev';

  const nvmrcExists = fs.existsSync('.nvmrc');
  if (nvmrcExists) {
    const nvmrc = fs.readFileSync('.nvmrc', 'utf-8');
    core.setOutput('NODE_VERSION', nvmrc);
  } else {
    core.info('No .nvmrc file found, skipping setting NODE_VERSION output.');
  }

  const { eventName, ref } = github.context;
  const refToEnv: Record<string, Env> = {
    master: 'prod',
    main: 'prod',
    qa: 'qa',
    stage: 'stage',
    staging: 'stage',
    dev: 'dev',
    develop: 'dev',
  };
  const env = eventName === 'release' ? 'prod' : refToEnv[ref];
  const envExists = env && fs.existsSync(`.env.${env}`);
  if (envExists) {
    core.info(`Copying .env.${env} --> .env`);
    fs.copyFileSync(`.env.${env}`, '.env');

    const envFile = path.resolve(__dirname, '.env');
    const dotEnvConfig = dotenv.config({ path: envFile });
    const parsedEnvFile = dotEnvConfig.parsed;
    if (dotEnvConfig.error || !parsedEnvFile) throw dotEnvConfig.error;
    Object.entries(parsedEnvFile).forEach(([key, val]) => {
      core.info(`Setting output: ${key}`);
      core.setOutput(key, val);
    });
  } else {
    core.info(`Could not find a .env file for env: ${env}`);
  }

  if (!envExists && !nvmrcExists) {
    throw new Error('No .nvmrc or .env file found');
  }
} catch (error) {
  core.setFailed(error.message);
}
