export class LogManager {
  static getFormattedDateTime(): string {
    const now = new Date();
    return now.toLocaleString();
  }

  static logInfo(message: string): void {
    console.log(`[+] [${this.getFormattedDateTime()}] - ${message}`);
  }
}
