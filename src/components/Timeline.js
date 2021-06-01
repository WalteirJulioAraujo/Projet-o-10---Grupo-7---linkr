import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller';
import { useState, useContext, useEffect } from 'react';
import { Container, Posts, Trending, Load } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import { useLocation } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import TrendingBar from './TrendingBar';
import CreatePosts from './CreatePosts';

export default function Timeline(){
    const {user, setUser} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const location = useLocation();

    useEffect(() => {loadingPosts()},[])

    function loadingPosts(page) {
        const localstorage = JSON.parse(localStorage.user);
        const token = localstorage.token;
        setIsLoading(true)
        setIsError(false)
        const config = { headers:{ Authorization: `Bearer ${token}`}};
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts', config)

        request.then( response => {
            console.log("objeto resp:",response)
            setUser(localStorage.user);
            const data = response.data.posts
            setPosts([...response.data.posts])
            setIsLoading(false)
            if(posts === data) {
                setIsEmpty(true)
            } else {
                setIsEmpty(false)
            }
        })

        request.catch( () => {setIsError(true); setIsLoading(false)})
    }

    return(
        <>
            <Navbar />
            <Container>
                <h1>timeline</h1>
                <div>
                    <Posts>
                        { isLoading ? "" : <CreatePosts loadingPosts = {loadingPosts}/>}
                        { isLoading ? <Load>Loading</Load> : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { isEmpty && !isLoading ? <Load>Nenhum post encontrado</Load> : ""}
                        <InfiniteScroll pageStart={0} hasMore>
                            {posts.map( post => 
                                <Post 
                                    key={post.id} id={post.id} post={post} 
                                    postUser={post.user} likes={post.likes}
                                    reloadingPosts={loadingPosts}
                                    location={location}

                                />)
                            }
                        </InfiniteScroll>
                    </Posts>
                    <Trending >
                        <TrendingBar />
                    </Trending>
                </div>
            </Container>
        </>
    )
}