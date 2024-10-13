import { execSync } from 'child_process';

export default async () => {
  console.log('Stopping the app...');
  execSync('make stop-app', { stdio: 'inherit' });
};
