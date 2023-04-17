import React from 'react';
// import { Route } from 'react-router-dom';

import perspective from '@finos/perspective/dist/esm/perspective.js';

import { View } from '../common';

// import CashFlow from './CashFlow';
// import NetWorth from './NetWorth';
// import Overview from './Overview';

import '@finos/perspective-viewer/dist/esm/perspective-viewer.js';
import '@finos/perspective-viewer-datagrid';
import '@finos/perspective-viewer-d3fc';

import '@finos/perspective-viewer/dist/css/pro-dark.css';

export default function Reports() {
  console.log('PSP ', perspective);
  const worker = perspective.worker();
  const req = fetch(
    'https://cdn.jsdelivr.net/npm/superstore-arrow/superstore.arrow',
  );

  async function load() {
    console.log('Loading', worker);
    // const resp = await req;
    // const arrow = await resp.arrayBuffer();
    // const el = document.querySelector('perspective-viewer');
    // const table = worker.table(arrow);
    // el.load(table);
    // el.restore({
    //   settings: true,
    //   plugin_config: { editable: true },
    // });
    console.log('Loaded', req);
  }
  load();
  // return (
  //   <View style={{ flex: 1 }} data-testid="reports-page">
  //     <Route path="/reports" exact component={Overview} />
  //     <Route path="/reports/net-worth" exact component={NetWorth} />
  //     <Route path="/reports/cash-flow" exact component={CashFlow} />
  //   </View>
  // );
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      data-testid="reports-page"
    >
      <perspective-viewer style={{ height: '100%' }}></perspective-viewer>
    </View>
  );
}
