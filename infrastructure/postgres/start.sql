

CREATE DATABASE postgres;

CREATE SCHEMA IF NOT EXISTS microservice01;
CREATE TABLE IF NOT EXISTS microservice01.bloqueio_pagamento_global (
    id SERIAL PRIMARY KEY, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    active BOOLEAN DEFAULT true
);

insert into microservice01.bloqueio_pagamento_global (active) values (true)

-- CREATE TABLE IF NOT EXISTS microservice01.bloqueio_pagamento_global (
--     id SERIAL PRIMARY KEY, 
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
--     des_documento VARCHAR(125) not null,
--     active BOOLEAN DEFAULT true
-- );
 
 CREATE DATABASE legado;
create schema if not exists legacy01;

CREATE TABLE IF NOT EXISTS legacy01.bloqueio_geracao_boleto_global (
    id SERIAL PRIMARY KEY, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true
);
 