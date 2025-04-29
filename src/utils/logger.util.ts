/**
 * Logger utility class for conditional logging based on environment flags
 * @module LoggerUtil
 * @description Provides methods for conditional logging that respect environment flags
 */

/**
 * Logger utility class
 * @class LoggerUtil
 */
export class LoggerUtil {
  /**
   * Environment flag that controls logging behavior
   * @private
   * @type {boolean}
   */
  private static isDebugEnabled: boolean = process.env.NODE_ENV === 'testnet';

  /**
   * Logs a message to the console if debug mode is enabled
   * @static
   * @param {...any} args - Arguments to log
   */
  static log(...args: any[]): void {
    if (this.isDebugEnabled) {
      console.log(...args);
    }
  }

  /**
   * Logs a debug message to the console if debug mode is enabled
   * @static
   * @param {...any} args - Arguments to log
   */
  static debug(...args: any[]): void {
    if (this.isDebugEnabled) {
      console.debug(...args);
    }
  }

  /**
   * Logs a warning message to the console if debug mode is enabled
   * @static
   * @param {...any} args - Arguments to log
   */
  static warn(...args: any[]): void {
    if (this.isDebugEnabled) {
      console.warn(...args);
    }
  }

  /**
   * Logs an error message to the console regardless of debug mode
   * @static
   * @param {...any} args - Arguments to log
   */
  static error(...args: any[]): void {
    console.error(...args);
  }

  /**
   * Sets the debug mode state
   * @static
   * @param {boolean} enabled - Whether debug mode should be enabled
   */
  static setDebugMode(enabled: boolean): void {
    this.isDebugEnabled = enabled;
  }
} 