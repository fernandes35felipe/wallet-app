import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import Layout from "../Components/Layout";
import Dashboard from '../Pages/Dashboard';
import List from '../Pages/List';
import NewUser from '../Pages/NewUser';

const AppRoutes: React.FC = () => (
  <Layout>
    <Switch >
        <Route path='/dashboard' exact component={Dashboard}/>
        <Route path='/list/:type' exact component={List}/>
    </Switch>
  </Layout>
);

export default AppRoutes;