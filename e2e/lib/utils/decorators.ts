import { Logger } from '@utils/logger';

export function LogExecution(
  target: any,
  context: ClassMethodDecoratorContext
) {
  const originalMethod = target;

  function replacementMethod(this: any, ...args: any[]) {
    const logger: Logger = this.logger;
    const className = this.constructor.name;
    const methodName = `${className}.${String(context.name)}`;
    logger.info(`Executing ${methodName}`, { args });

    try {
      const result = originalMethod.apply(this, args);
      if (result && typeof result.then === 'function') {
        return result
          .then((res: any) => {
            logger.debug(`Executed ${methodName} successfully`, { res });
            return res;
          })
          .catch((error: any) => {
            logger.error(`Error in ${methodName}`, { error });
            throw error;
          });
      } else {
        logger.debug(`Executed ${methodName} successfully`, { result });
        return result;
      }
    } catch (error) {
      logger.error(`Error in ${methodName}`, { error });
      throw error;
    }
  }

  return replacementMethod;
}
