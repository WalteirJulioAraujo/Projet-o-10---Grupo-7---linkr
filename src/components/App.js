import {BrowserRouter, Switch, Route } from 'react-router-dom';
import { useState } from 'react';
import GlobalStyle from '../styles/GlobalStyle';
import Hashtag from './Hashtag';
import LogIn from './LogIn';
import Mylikes from './MyLikes';
import MyPosts from './MyPosts';
import SignUp from './SignUp';
import Timeline from './Timeline';
import User from './User';

import UserContext from "../contexts/UserContext"

export default function App(){

    const [ user, setUser ] = useState(undefined);
    const [ followingUsers, setFollowingUsers] = useState([])
    return (
        <UserContext.Provider value={{user, setUser, followingUsers, setFollowingUsers}}>
            <GlobalStyle />
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <LogIn />
                    </Route>
                    <Route path="/sign-up" exact>
                        <SignUp />
                    </Route>
                    <Route path="/timeline" exact>
                        <Timeline />
                    </Route>
                    <Route path="/my-posts" exact>
                        <MyPosts />
                    </Route>
                    <Route path="/my-likes" exact>
                        <Mylikes />
                    </Route>
                    <Route path="/user/:id" exact>
                        <User />
                    </Route>    
                    <Route path="/hashtag/:hashtag" exact>
                        <Hashtag />
                    </Route>
                </Switch>
            </BrowserRouter>
        </UserContext.Provider>
    )
}