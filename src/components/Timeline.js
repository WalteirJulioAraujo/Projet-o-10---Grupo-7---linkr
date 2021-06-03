import axios from 'axios'
import { useState, useContext, useEffect } from 'react';
import { Container, Posts, Trending, Load } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import { useLocation } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import loading from '../img/loading.svg'
import TrendingBar from './TrendingBar';
import CreatePosts from './CreatePosts';
import useInterval from 'react-useinterval';

export default function Timeline(){
    const {user, setUser} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [isFollowing, setIsFollowing] = useState(true)
    const [followingUsers,setFollowingUsers] = useState([]);
    const location = useLocation();
    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers:{ Authorization: `Bearer ${token}`}};

    useEffect(() => {checkFollowingUsers()},[])

    function checkFollowingUsers() {
        setIsLoading(true)
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows', config)

        request.then( response => {
            console.log(response.data.users)
            setUser(localStorage.user);
            const following = response.data.users;
            setFollowingUsers(following);
            if(following.length !== 0){
                loadingPosts()
                return
            }
            setIsLoading(false)
            setIsFollowing(false)
        })

        request.catch( () => {setIsError(true); setIsLoading(false)})
    }

    function loadingPosts() {
        setIsEmpty(false)
        setIsError(false)
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/following/posts', config)

        request.then( response => {
            console.log(response.data);
            const data = response.data.posts
            setPosts([...response.data.posts])
            setIsLoading(false)
            setIsFollowing(true)
            if(data.length === 0) {
                setIsEmpty(true)
            }
        })

        request.catch( () => {setIsError(true); setIsLoading(false)});
    }

    
    useInterval(checkFollowingUsers, 15000);

    return(
        <>
            <Navbar />
            <Container>
                <h1>timeline</h1>
                <div>
                    <Posts>
                        { isLoading ? <Load><div><img src={loading}/> Loading...</div></Load>  : <CreatePosts loadingPosts = {loadingPosts}/>}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { isFollowing ? "" :<Load>Você não segue ninguém ainda, procure por perfis na busca</Load>}
                        { isEmpty ? <Load>Nenhuma publicação encontrada</Load> : ""}
                        {posts.map( post => 
                            <Post 
                                key={post.id} id={post.id} post={post} 
                                postUser={post.user} likes={post.likes}
                                reloadingPosts={loadingPosts}
                                location={location} 

                            />)
                        }
                    </Posts>
                    <Trending >
                        <TrendingBar />
                    </Trending>
                </div>
            </Container>
        </>
    )
}