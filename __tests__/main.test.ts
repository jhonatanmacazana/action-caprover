import "dotenv/config";

import { test } from "@jest/globals";
import cp from "child_process";
import path from "path";
import process from "process";

type TestArgs = Parameters<typeof test>;

const testIf = (condition: boolean, ...args: TestArgs) =>
  condition ? test(...args) : test.skip(...args);

// shows how the runner will run a javascript action with env / stdout protocol

const shouldRunTests = process.env.RUN_CAPROVER_TESTS === "true";

const APP_NAME = "test-123";

testIf(shouldRunTests, "test runs", () => {
  launchWithConfig({
    INPUT_ACTION: "deploy",
  });
});

testIf(shouldRunTests, "create an app with db", () => {
  launchWithConfig({
    INPUT_APP: APP_NAME,
    INPUT_ACTION: "create-app",
  });
});

testIf(shouldRunTests, "delete an app", () => {
  launchWithConfig({
    INPUT_APP: APP_NAME,
    INPUT_ACTION: "delete-app",
  });
  launchWithConfig({
    INPUT_APP: `${APP_NAME}-db`,
    INPUT_ACTION: "delete-app",
  });
});

testIf(shouldRunTests, "update registry password", () => {
  launchWithConfig({
    INPUT_APP: APP_NAME,
    INPUT_ACTION: "update-registry-password",
    INPUT_REGISTRY_PASSWORD: process.env.INPUT_REGISTRY_PASSWORD || "test",
  });
});

function launchWithConfig(config: Record<string, string>) {
  const np = process.execPath;
  const ip = path.join(__dirname, "..", "lib", "main.js");
  const options: cp.ExecFileSyncOptions = {
    env: { ...process.env, ...config },
  };
  console.log(cp.execFileSync(np, [ip], options).toString());
}

// INPUT_HOST: process.env.INPUT_HOST || "",
// INPUT_PASSWORD: process.env.INPUT_PASSWORD || "",
// INPUT_APP: process.env.INPUT_APP || "test-123",
// INPUT_ACTION: process.env.INPUT_ACTION || "create-app",
// INPUT_IMAGE: process.env.INPUT_IMAGE || "",
// INPUT_FAIL_IF_EXISTS: process.env.INPUT_FAIL_IF_EXISTS || "",
// INPUT_REGISTRY_PASSWORD: process.env.INPUT_REGISTRY_PASSWORD || "",
