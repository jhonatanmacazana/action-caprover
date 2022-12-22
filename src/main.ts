/* eslint-disable no-case-declarations */
import * as core from "@actions/core";

import {
  getAllApps,
  getAuthToken,
  registerNewApp,
  deleteApp,
  getDockerRegistries,
  updateDockerRegistry,
} from "./api/caprover";
import { createFetcher } from "./api/fetcher";

const ActionValues = ["deploy", "create-app", "delete-app", "update-registry-password"] as const;
type Action = typeof ActionValues[number];

async function run() {
  try {
    const host = core.getInput("host");
    const password = core.getInput("password");
    const app = core.getInput("app");
    const action = core.getInput("action");

    // const image = core.getInput("image");
    const failIfExists = core.getInput("fail_if_exists");
    const registryPassword = core.getInput("registry_password");

    // validate action
    if (!ActionValues.includes(action as Action)) {
      throw new Error(`Invalid action: ${action}`);
    }

    const fetcher = createFetcher(host);
    await getAuthToken(fetcher, password);

    switch (action as Action) {
      case "create-app":
        const allApps = await getAllApps(fetcher);
        const appExists = allApps.some(a => a.appName === app);
        if (appExists) {
          if (failIfExists === "true") {
            throw new Error(`App ${app} already exists`);
          } else {
            core.warning(`App ${app} already exists`);
          }
          return;
        }

        core.debug(`Creating app ${app}`);
        const newApp = await registerNewApp(fetcher, app, false);
        const newAppDB = await registerNewApp(fetcher, `${app}-db`, true);
        core.debug(`New app: ${JSON.stringify(newApp)}`);
        core.debug(`New app DB: ${JSON.stringify(newAppDB)}`);

        core.setOutput("app", newApp.appName);
        return;

      case "delete-app":
        const allAppsD = await getAllApps(fetcher);
        const appExistsD = allAppsD.some(a => a.appName === app);
        if (appExistsD) {
          core.debug(`Deleting app ${app}`);
          await deleteApp(fetcher, app);
        } else {
          core.warning(`App ${app} does not exist`);
        }
        return;

      case "update-registry-password":
        // validate registryPassword
        if (!registryPassword) {
          throw new Error(`Registry password is required`);
        }

        const allRegistries = await getDockerRegistries(fetcher);

        const registry = allRegistries.find(r => r.registryUser.includes("AWS"));
        if (!registry) {
          throw new Error(`Registry for AWS not found`);
        }

        core.debug(`Updating registry ${registry.registryDomain}`);
        const res = await updateDockerRegistry(fetcher, { ...registry, registryPassword });
        core.debug(`Updated registry: ${JSON.stringify(res)}`);

        return;

      case "deploy":
      default:
        break;
    }

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
