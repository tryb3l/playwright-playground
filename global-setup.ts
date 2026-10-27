import { ensureAppServerReachable } from '@utils/app-server';

export default async function globalSetup() {
  return await ensureAppServerReachable();
}