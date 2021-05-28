import axios from 'axios'
import styled from 'styled-components'
import { useState, useContext, useEffect } from 'react';
import { Container, Posts, Trending } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import UserContext from "../contexts/UserContext";
import TrendingBar from './TrendingBar';
import CreatePosts from './CreatePosts';

export default function Timeline(){
    console.log(localStorage)
    //const {user} = useContext(UserContext);
    const user = JSON.parse(localStorage.getItem('user'))
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {loadingPosts()},[])

    function loadingPosts() {
        setIsLoading(true)
        setIsError(false)
        const config = { headers:{ Authorization: `Bearer ${user.token}`}};
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts', config)

        request.then( response => {
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
                        { isLoading ? <Load>Loading</Load> : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { isEmpty && !isLoading ? <Load>Nenhum post encontrado</Load> : ""}
                        <CreatePosts loadingPosts = {loadingPosts}/>
                        {posts.map( post => 
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