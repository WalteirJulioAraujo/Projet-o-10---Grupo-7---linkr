import { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller';
import loading from '../img/loading.svg'
import { Container, Posts, Trending, Load, PageTitle } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import TrendingBar from "./TrendingBar";
import useInterval from 'react-useinterval';
import { ContainerModal,Modal } from '../styledComponents/Content';

import UserContext from "../contexts/UserContext";

export default function Mylikes(){

    const {user, setUser} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [afterLoading, setAfterLoading] = useState(null)
    const [hasMorePosts, setHasMorePosts] = useState(false)
    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers:{ Authorization: `Bearer ${token}`}};
    const loadingMore = <Load><div><img src={loading}/> Loading more posts...</div></Load>

    const [modal, setModal] = useState(false);
    const [link, setLink ] = useState("");
    useEffect(() => {loadingPosts()},[])

    function loadingPosts() {
        setIsLoading(true);
        setIsError(false);
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked', config)

        request.then( response => {
            setPosts(response.data.posts)
            setIsLoading(false)
            if(posts.length === 0){
                setAfterLoading(<Load>Nenhuma publicação encontrada</Load>)
                setHasMorePosts(false)
            }
            setHasMorePosts(true)   
        })
        request.catch( (error) => {
            if(error.response.data === 404){
                setIsError(false)
            } else{
                setIsError(true)
            }; 
            setIsLoading(false);setHasMorePosts(false)})
    }
    
    function updatePosts(){
        setIsError(false)
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked/posts?earlierThan=${posts[0].id}`,config)
        
        request.then( response => {
            if(response.data.posts != undefined){
                setPosts([...response.data.posts, ...posts]);
            } 
        })
        
        request.catch( () => {setIsError(true); setIsLoading(false); setHasMorePosts(false)})
    }
    
    function fetchPosts(){
        setIsError(false)
        if(posts.length > 200){
            setHasMorePosts(false)
            return
        }
        if(posts.length !== 0){
            const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked/posts?offset=20}`, config)
    
            request.then( response => {
                if(response.data.posts.length < 10){
                    setHasMorePosts(false)
                } 
                setTimeout(() => setPosts([...posts,...response.data.posts]),1000)

            })
    
            request.catch( () => {setIsError(true); setIsLoading(false); setHasMorePosts(false)})
        }
    }
    function OpenModal(e){
        setLink(e);
        setModal(true);
    }

    
    function CloseModal(){
          setModal(false);
    }
    
    function OpenInNewTab(){
          window.open(link)
    }

    //useInterval(updatePosts, 15000);

    return(
        <>
            <Navbar />
            <Container>
                <PageTitle>
                    <h1>my likes</h1>
                </PageTitle>                
                <div>
                    <Posts>
                        { isLoading ? <Load><div><img src={loading}/> Loading...</div></Load>  : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { posts === undefined || (posts.length === 0 && afterLoading === null) || posts.length !== 0 ? "" : afterLoading}
                        <InfiniteScroll pageStart={0} loader={loadingMore} hasMore={hasMorePosts} loadMore={fetchPosts}>
                            {posts.map( post => 
                                <Post 
                                    key={post.id} id={post.id} post={post} 
                                    postUser={post.user} likes={post.likes}
                                    OpenModal={OpenModal}
                                />)
                            }
                        </InfiniteScroll>
                    </Posts>
                    <Trending >
                        <TrendingBar />
                    </Trending>
                </div>
            </Container>
            {modal
            ?<ContainerModal>
                <div>
                    <button className="OpenInNewTab" onClick={OpenInNewTab}>Open in new tab</button>
                    <button className="CloseModal"onClick={CloseModal}>X</button>
                </div>
                <Modal>
                    <iframe src={link}></iframe>
                </Modal>
            </ContainerModal>
            :""
            }
        </>
    )
}