import { execSync } from 'child_process';

export default async () => {
  try {
    console.log('Starting the app...');
    execSync('make run-app', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to start the app:', error);
    process.exit(1);
  }
};
