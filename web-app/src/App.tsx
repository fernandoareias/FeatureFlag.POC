import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gql, useLazyQuery } from '@apollo/client';
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

function App() {
  const [getFlags, { loading, error, data }] = useLazyQuery(GET_FEATURE_FLAGS);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    const tables = ["bloqueio_pagamento_global", "bloqueio_geracao_boleto_global"];
    getFlags({ variables: { tables } });
  }, [getFlags]);

  const handleSwitchChange = (tableName: number, flag: boolean) => {
    // setFeatureFlags(prevFlags =>
    //   prevFlags.map((flag, i) =>
    //     i === index ? { ...flag, active: !flag.active } : flag
    //   )
    // );
    console.log("Mudou " + tableName + " de " + flag + " para " + !flag);
  };

  useEffect(() => {
    
    if(!data) return;
    let lista: FeatureFlag[] = data.getFeatureFlags.featureFlags.map((flag: any) => {
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

        {loading && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}
        {error && <p>Error: {error.message}</p>}
        {featureFlags && (
         
         <Form className='row row-cols-2 row-cols-lg-5 g-2 g-lg-3'> 
            {featureFlags.map((flag: any, index: any) => ( 
              <div className='col w-100'>
                <Form.Check
                  key={index}
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
