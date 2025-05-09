/**
 * Logger class for logging messages with timestamps.
 *
 * Implements the Singleton pattern to ensure a single instance is used.
 */
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  /**
   * Logs a general message.
   *
   * @param {string} message - The message to log.
   */
  log(message) {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Logs an info message.
   *
   * @param {string} message - The information message to log.
   */
  info(message) {
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Logs a warning message.
   *
   * @param {string} message - The warning message to log.
   */
  warn(message) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Logs an error message.
   *
   * @param {string} message - The error message to log.
   */
  error(message) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}

const logger = new Logger();
Object.freeze(logger);

export default logger;
