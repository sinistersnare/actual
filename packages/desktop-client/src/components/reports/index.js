import React, { useEffect, useRef, useState } from 'react';
// import { Route } from 'react-router-dom';

import { View } from '../common';

import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';
import '@finos/perspective-viewer-d3fc';
import '@finos/perspective-viewer/dist/css/pro-dark.css';

// import CashFlow from './CashFlow';
// import NetWorth from './NetWorth';
// import Overview from './Overview';

export default function Reports() {
  const [psp, setPsp] = useState(null);
  const [_data, setData] = useState(null);
  const pspRef = useRef(null);
  useEffect(() => {
    async function getPsp() {
      let { default: psp } = await import(
        /* webpackChunkName: 'perspective' */ '@finos/perspective/dist/esm/perspective.js'
      );
      console.log('PSP: ', psp);
      setPsp(psp);
      const res = await fetch(
        'https://cdn.jsdelivr.net/npm/superstore-arrow/superstore.arrow',
      );
      const arrow = await res.arrayBuffer();
      setData(arrow);

      const worker = psp.worker();
      console.log('worker! ', worker);
      // const table = worker.table(arrow);
      // if (pspRef.current) {
      //   console.log('GOOD!', pspRef.current);
      //   pspRef.current.load(table);
      //   pspRef.current.restore({ settings: true });
      // } else {
      //   console.log('WHAT??????');
      // }
    }
    getPsp();
  }, []);
  return (
    <View style={{ flex: 1 }} data-testid="reports-page">
      <perspective-viewer ref={pspRef}></perspective-viewer>
      {psp === null ? <p>Loading ....</p> : <p>Done!!!!</p>}
    </View>
  );
}
