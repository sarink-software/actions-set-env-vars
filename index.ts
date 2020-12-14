import core from '@actions/core';
import github from '@actions/github';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

try {
  type Env = 'prod' | 'qa' | 'stage' | 'dev';

  const nvmrc = fs.readFileSync('.nvmrc', 'utf-8');
  if (nvmrc) core.setOutput('NODE_VERSION', nvmrc);

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
  if (!env) throw new Error(`Could not find a suitable env for github.ref: ${ref}`);

  core.debug(`Copying .env.${env} --> .env`);
  fs.copyFileSync(`.env.${env}`, '.env');

  const envFile = path.resolve(__dirname, '.env');
  const dotEnvConfig = dotenv.config({ path: envFile });
  const parsedEnvFile = dotEnvConfig.parsed;
  if (dotEnvConfig.error || !parsedEnvFile) throw dotEnvConfig.error;
  Object.entries(parsedEnvFile).forEach(([key, val]) => {
    core.setOutput(key, val);
  });
} catch (error) {
  core.setFailed(error.message);
}
