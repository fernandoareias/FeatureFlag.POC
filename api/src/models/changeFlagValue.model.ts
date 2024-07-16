export class ChangeFlagValue {
  active: boolean;
  table: string;
  column: string;
  database: {
    host: string;
    username: string;
    password: string;
    port: number;
  };

  constructor(data: any) {
    this.active = data.active;
    this.table = data.table;
    this.column = data.column;
    this.database = {
      host: data.database.host,
      username: data.database.username,
      password: data.database.password,
      port: data.database.port,
    };
  }

  toString() {
    return JSON.stringify(this);
  }
}
