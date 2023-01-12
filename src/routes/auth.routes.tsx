import React from "react";
import {Switch, Route} from 'react-router-dom'
import NewUser from "../Pages/NewUser";

import SignIn from "../Pages/SignIn";

const AuthRoutes: React.FC = () => (
    <Switch>
        <Route path='/login' exact component={SignIn} />
        <Route path='/' exact component={SignIn} />
        <Route path='/newUser' exact component={NewUser}/>
    </Switch>
)

export default AuthRoutes