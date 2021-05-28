import { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import styled from 'styled-components'
import { Container, Posts, Trending } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import TrendingBar from "./TrendingBar";

import UserContext from "../contexts/UserContext";

export default function Mylikes(){

    //const {user} = useContext(UserContext);
    const user = JSON.parse(localStorage.getItem('user'));
    const [likedPosts, setLikedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {loadingPosts()},[])

    function loadingPosts() {
        setIsLoading(true)
        setIsError(false)
        const config = { headers:{ Authorization: `Bearer ${user.token}`}};
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked', config)

        request.then( response => {
            const data = response.data.posts
            setLikedPosts([...response.data.posts])
            setIsLoading(false)
            if(likedPosts === data) {
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
                <h1>my Likes</h1>
                <div>
                    <Posts>
                        { isLoading ? <Load>Loading</Load> : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { isEmpty && !isLoading ? <Load>Ainda não há posts curtidos por você</Load> : ""}
                        {likedPosts.map( post => 
                            <Post 
                                key={post.id} id={post.id} post={post} 
                                postUser={post.user} likes={post.likes}
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

const Load = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    color: #FFF;
    font-size: 30px;
`