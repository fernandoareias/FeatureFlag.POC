import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Form, Spinner } from 'react-bootstrap';
import { FeatureFlag } from './models/FeatureFlag';

const GET_FEATURE_FLAGS = gql`
  query GetFeatureFlags($tables: [String!]!) {
    getFeatureFlags(tables: $tables) {
      featureFlags {
        active
        tableName
        aliasName
      }
      message
    }
  }
`;

const TOGGLE_FEATURE_FLAG = gql`
  mutation SetFeatureFlag($table: String!, $active: Boolean!) {
    setFeatureFlag(table: $table, active: $active) {
      success
    }
  }
`;

function App() {
  const [getFlags, { loading, error, data }] = useLazyQuery(GET_FEATURE_FLAGS);
  const [toggleFeatureFlag] = useMutation(TOGGLE_FEATURE_FLAG);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    const tables = ["bloqueio_pagamento_global", "bloqueio_geracao_boleto_global"];
    getFlags({ variables: { tables } });
  }, [getFlags]);

  const handleSwitchChange = (tableName: string, currentFlag: boolean) => {
    const newFlag = !currentFlag;

    toggleFeatureFlag({
      variables: {
        table: tableName,
        active: newFlag
      }
    })
    .then(response => {
      if (response.data.setFeatureFlag.success) {
        setFeatureFlags(prevFlags =>
          prevFlags.map(flag =>
            flag.tableName === tableName ? { ...flag, active: newFlag } : flag
          )
        );
      }
    })
    .catch(error => {
      console.error("Erro ao mudar o flag:", error);
    });
  };

  useEffect(() => {
    if (!data) return;
    const lista: FeatureFlag[] = data.getFeatureFlags.featureFlags.map((flag: any) => {
      return new FeatureFlag(flag.tableName, flag.active, flag.aliasName);
    });

    setFeatureFlags(lista);
  }, [data]);

  return (
    <div>
      <main className='container'>
        <div className='mb-5 mt-5'>
          <h1>Feature Flags</h1>
        </div>

        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <p>Error: {error.message}</p>}
        {featureFlags && (
          <Form className='row row-cols-2 row-cols-lg-5 g-2 g-lg-3'>
            {featureFlags.map((flag: any, index: any) => (
              <div className='col w-100' key={index}>
                <Form.Check
                  type="switch"
                  id={flag.tableName}
                  label={flag.aliasName}
                  checked={flag.active}
                  onChange={() => handleSwitchChange(flag.tableName, flag.active)}
                />
              </div>
            ))}
          </Form>
        )}
      </main>
    </div>
  );
}

export default App;
