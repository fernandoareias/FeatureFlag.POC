export class LogManager {
  static getFormattedDateTime(): string {
    const now = new Date();
    return now.toLocaleString();
  }

  static logInfo(message: string): void {
    console.log(`[+] [${this.getFormattedDateTime()}] - ${message}`);
  }

  static logError(message: string): void {
    console.error(`[-] [${this.getFormattedDateTime()}] - ${message}`);
  }
}
