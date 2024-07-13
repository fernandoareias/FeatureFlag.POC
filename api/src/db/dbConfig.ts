export interface DbConfig {
  databaseConfig: {
    [key: string]: {
      user: string;
      host: string;
      password: string;
      port: number;
    };
  };
}

export interface TableConfig {
  tables: {
    [key: string]: {
      database: string;
      schema: string;
      column: string;
      expected: string;
    };
  };
}

export const tableConfig: TableConfig = {
  tables: {
    bloqueio_pagamento_global: {
      database: "postgres",
      schema: "microservice01",
      column: "active",
      expected: "true",
    },
    bloqueio_geracao_boleto_global: {
      database: "legado",
      schema: "legacy01",
      column: "active",
      expected: "true",
    },
  },
};

export const dbConfig: DbConfig = {
  databaseConfig: {
    postgres: {
      user: "postgres",
      host: "localhost",
      password: "Postgres2022!",
      port: 5432,
    },
    legado: {
      user: "postgres",
      host: "localhost",
      password: "Postgres2022!",
      port: 5432,
    },
  },
};
