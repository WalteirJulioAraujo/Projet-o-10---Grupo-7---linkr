import axios from 'axios'
import { useState, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import useInterval from 'react-useinterval';

import { Container, Posts, Trending, Load, PageTitle, ContainerModal,Modal } from "../styledComponents/Content";
import loading from '../img/loading.svg'

import Navbar from './Navbar';
import Post from "./Post/Post"
import TrendingBar from "./TrendingBar";

import UserContext from "../contexts/UserContext";

export default function Hashtag(){
    const {user, setUser} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [hasMorePosts, setHasMorePosts] = useState(false)
    const [afterLoading, setAfterLoading] = useState(null)
    const { hashtag } = useParams();
    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers:{ Authorization: `Bearer ${token}`}};
    const loadingMore = <Load><div><img src={loading}/> Loading more posts...</div></Load>
    const [modal, setModal] = useState(false);
    const [link, setLink ] = useState("");
    const location = useLocation();

    useEffect(() => {loadingHashtag()},[hashtag])

    function loadingHashtag() {
        setPosts([])
        setIsLoading(true)
        setAfterLoading(null)
        setIsError(false) 
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/${hashtag}/posts`, config)

        request.then( response => {
            setPosts(response.data.posts)
            setIsLoading(false)
            if(posts.length === 0){
                setAfterLoading(<Load>Nenhuma publicação encontrada</Load>)
                setHasMorePosts(false)
            }
            setHasMorePosts(true)   
        })
        request.catch( () => {setIsError(true); setIsLoading(false);setHasMorePosts(false)})
    }

    function updatePosts(){
        setIsError(false)
        if(posts.length !== 0){
            let request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/${hashtag}/posts?earlierThan=${posts[0].id}`,config)
        
            request.then( response => {
                if(response.data.posts != undefined){
                    setPosts([...response.data.posts, ...posts]);
                } 
            })
        
            request.catch( () => {setIsError(true); setIsLoading(false); setHasMorePosts(false)})
        } else {
            setAfterLoading(<Load>Nenhuma publicação encontrada</Load>)
            setHasMorePosts(false)
        }
    }

    function fetchPosts(){
        setIsError(false)
        if(posts.length > 200){
            setHasMorePosts(false)
            return
        }
        if(posts.length !== 0){
            const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/${hashtag}/posts?olderThan=${posts[posts.length - 1].id}`, config)

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

    useInterval(updatePosts, 15000);

    return(
        <>
            <Navbar />
            <Container>
                <PageTitle>
                    <h1>#{hashtag}</h1>
                </PageTitle>                
                <div>
                    <Posts>
                        { isLoading ? <Load><div><img src={loading}/> Loading...</div></Load>  : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { posts === undefined || (posts.length === 0 && afterLoading === null) || posts.length !== 0 ? "" : afterLoading}
                        <InfiniteScroll pageStart={0} loader={loadingMore} hasMore={hasMorePosts} loadMore={fetchPosts}>
                            {posts.map( post => 
                            <Post 
                                key={post.repostId || post.id} id={post.id} post={post} 
                                postUser={post.user} likes={post.likes}
                                loadingHashtag={loadingHashtag}
                                location={location} OpenModal={OpenModal}
                                hashtag={hashtag}
                            />)}
                        </InfiniteScroll>)
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