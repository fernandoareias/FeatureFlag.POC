export interface DbConfig {
  defaultConfig: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
  };
  tables: {
    [key: string]: {
      schema: string;
    };
  };
}

const dbConfig: DbConfig = {
  defaultConfig: {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Postgres2022!",
    port: 5432,
  },
  tables: {
    bloqueio_pagamento_global: {
      schema: "microservice01",
    },
    bloqueio_geracao_boleto_global: {
      schema: "legacy01",
    },
  },
};

export default dbConfig;
