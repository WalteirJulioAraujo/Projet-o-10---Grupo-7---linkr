import { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import styled from 'styled-components'
import { Container, Posts, Trending, Load, PageTitle } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import TrendingBar from "./TrendingBar";
import useInterval from 'react-useinterval';
import { ContainerModal,Modal } from '../styledComponents/Content';

import UserContext from "../contexts/UserContext";

export default function Mylikes(){

    const {user, setUser} = useContext(UserContext);
    const [likedPosts, setLikedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    const [modal, setModal] = useState(false);
    const [link, setLink ] = useState("");

    useEffect(() => {loadingPosts()},[])
    function loadingPosts() {
        const localstorage = JSON.parse(localStorage.user);
        const token = localstorage.token;
        setIsLoading(true);
        setIsError(false);
        const config = { headers:{ Authorization: `Bearer ${token}`}};
        const request = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/liked', config)

        request.then( response => {
            setUser(localStorage.user);
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

    useInterval(loadingPosts, 15000);

    return(
        <>
            <Navbar />
            <Container>
                <PageTitle>
                    <h1>my likes</h1>
                </PageTitle>                
                <div>
                    <Posts>
                        { isLoading ? <Load>Loading</Load> : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { isEmpty && !isLoading ? <Load>Ainda não há posts curtidos por você</Load> : ""}
                        {likedPosts.map( post => 
                            <Post 
                                key={post.id} id={post.id} post={post} 
                                postUser={post.user} likes={post.likes}
                                OpenModal={OpenModal}
                            />)
                        }
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