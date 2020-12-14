"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
try {
    const nvmrc = fs_1.default.readFileSync('.nvmrc', 'utf-8');
    if (nvmrc)
        core_1.default.setOutput('NODE_VERSION', nvmrc);
    const { eventName, ref } = github_1.default.context;
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
    if (!env)
        throw new Error(`Could not find a suitable env for github.ref: ${ref}`);
    core_1.default.debug(`Copying .env.${env} --> .env`);
    fs_1.default.copyFileSync(`.env.${env}`, '.env');
    const envFile = path_1.default.resolve(__dirname, '.env');
    const dotEnvConfig = dotenv_1.default.config({ path: envFile });
    const parsedEnvFile = dotEnvConfig.parsed;
    if (dotEnvConfig.error || !parsedEnvFile)
        throw dotEnvConfig.error;
    Object.entries(parsedEnvFile).forEach(([key, val]) => {
        core_1.default.setOutput(key, val);
    });
}
catch (error) {
    core_1.default.setFailed(error.message);
}
