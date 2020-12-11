import { join } from 'path';

export const getOsEnv = (key: string): string => {
  const value = (process.env[key] || '') as string;
  if (value === undefined) {
    console.error(`${key} is undefined`);
  }
  return value;
};

export const getPath = (path: string): string => {
  const additionalPrefix = process.env['PATH_PREFIX'] || '';
  return join(process.cwd(), additionalPrefix, path || '');
};

export const getPaths = (paths: string[]): string[] =>
  paths.map((p) => getPath(p));

export const getOsPath = (key: string): string => getPath(getOsEnv(key));

export const getOsEnvArray = (key: string, delimiter = ','): string[] =>
  (process.env[key] && process.env[key].split(delimiter)) || [];

export const getOsPaths = (key: string): string[] =>
  getPaths(getOsEnvArray(key));

export const toNumber = (value: string): number => parseInt(value, 10);

export const toBool = (value: string): boolean => value === 'true';

export const normalizePort = (port: string): number | string | boolean => {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    // named pipe
    return port;
  }
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return false;
};
