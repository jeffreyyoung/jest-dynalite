// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from "jest-environment-node";
import type { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";
import { CONFIG_FILE_NAME, NotFoundError } from "./config";

class DynaliteEnvironment extends NodeEnvironment {
  constructor(projectConfig: Config.ProjectConfig) {
    // The config directory is based on the root directory
    // of the project config

    const { rootDir } = projectConfig;
    try {
      setup(rootDir);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new Error(`
jest-dynalite could not find "${CONFIG_FILE_NAME}" in the jest <rootDir> (${rootDir}).

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#advanced-setup

If you are already using a custom config directory, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv" instead of using the preset.

For more information, please see https://github.com/freshollie/jest-dynalite/#breaking-changes.
      `);
      }
      throw e;
    }

    super(projectConfig);
  }

  public async setup(): Promise<void> {
    await super.setup();
    await start();
  }

  public async teardown(): Promise<void> {
    await stop();
    await super.teardown();
  }
}

export default DynaliteEnvironment;
module.exports = DynaliteEnvironment;
