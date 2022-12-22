import type { AxiosInstance } from "axios";

import { getToken, setToken } from "./auth-token";

export const isLoggedIn = async () => Boolean(getToken());

export const getAuthToken = async (axiosInstance: AxiosInstance, password: string) => {
  const res = await axiosInstance.post("/api/v2/login", { password });
  const token = res.data.data.token as string;
  setToken(token);
  return token;
};

// --------------------------------
// query
// --------------------------------

export const getCaptainInfo = async (axiosInstance: AxiosInstance) => {
  const res = await axiosInstance.get("/api/v2/user/system/info");
  return res.data.data;
};

export const getAllApps = async (axiosInstance: AxiosInstance) => {
  const res = await axiosInstance.get("/api/v2/user/apps/appDefinitions");
  return res.data.data.appDefinitions as AppDefinition[];
};

export const getUnusedImages = async (axiosInstance: AxiosInstance, mostRecentLimit: number) => {
  const res = await axiosInstance.get("/api/v2/user/apps/appDefinitions/unusedImages", {
    params: { mostRecentLimit: String(mostRecentLimit) },
  });
  return res.data.data;
};

export const getDockerRegistries = async (axiosInstance: AxiosInstance) => {
  const res = await axiosInstance.get("/api/v2/user/registries");
  return res.data.data.registries as RegistryInfo[];
};

// --------------------------------
// mutations
// --------------------------------

export const registerNewApp = async (
  axiosInstance: AxiosInstance,
  appName: string,
  hasPersistentData: boolean
) => {
  const res = await axiosInstance.post("/api/v2/user/apps/appDefinitions/register?detached=1", {
    appName,
    hasPersistentData,
  });
  return res.data;
};

export const deleteApp = async (axiosInstance: AxiosInstance, appName: string) => {
  const res = await axiosInstance.post("/api/v2/user/apps/appDefinitions/delete", { appName });
  return res.data;
};

export const deleteImages = async (axiosInstance: AxiosInstance, imageIds: string[]) => {
  const res = await axiosInstance.post("/api/v2/user/apps/appDefinitions/deleteImages", {
    imageIds,
  });
  return res.data.data;
};

export const updateDockerRegistry = async (
  axiosInstance: AxiosInstance,
  registryInfo: RegistryInfo
) => {
  const res = await axiosInstance.post("/api/v2/user/registries/update", registryInfo);
  return res.data;
};

// --------------------------------
// types
// --------------------------------
type AppDefinition = {
  hasPersistentData: boolean;
  description: string;
  instanceCount: number;
  captainDefinitionRelativeFilePath: string;
  networks: string[];
  envVars: any[];
  volumes: any[];
  ports: any[];
  versions: { version: number; timeStamp: Date }[];
  deployedVersion: number;
  notExposeAsWebApp: boolean;
  customDomain: any[];
  hasDefaultSubDomainSsl: boolean;
  forceSsl: boolean;
  websocketSupport: boolean;
  appName: string;
  isAppBuilding: boolean;
};

type RegistryInfo = {
  id: string;
  registryUser: string;
  registryPassword: string;
  registryDomain: string;
  registryImagePrefix: string;
  registryType: "LOCAL_REG" | "REMOTE_REG";
};
