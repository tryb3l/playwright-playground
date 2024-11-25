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
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  info(message: string, metadata?: Record<string, any>) {
    this.logger.info(metadata, message);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.logger.warn(metadata, message);
  }

  error(message: string, error?: Error) {
    this.logger.error(error, message);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.logger.debug(metadata, message);
  }
}
