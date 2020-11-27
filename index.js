const core = require('@actions/core');
const dotenv = require('dotenv');

try {
  const envFile = path.resolve(__dirname, '.env');
  const dotEnvConfig = dotenv.config({ path: envFile });
  if (dotEnvConfig.error) throw dotEnvConfig.error;
  const parsedEnvFile = dotEnvConfig.parsed;
  Object.entries(parsedEnvFile).forEach(([key, val]) => core.setOutput(key, val));
} catch (error) {
  core.setFailed(error.message);
}
