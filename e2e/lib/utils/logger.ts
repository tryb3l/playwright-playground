import pino from 'pino';

export class Logger {
  private logger: pino.Logger;

  constructor(context: string) {
    this.logger = pino({
      name: context,
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: true,
          ignore: 'pid,hostname',
        },
      },
    });
  }

  info(message: string, ...args: any[]) {
    this.logger.info(message);
  }

  warn(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }
}
