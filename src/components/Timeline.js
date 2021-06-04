import axios from 'axios'
import { useState, useContext, useEffect } from 'react';
import { Container, Posts, Trending, Load, PageTitle } from "../styledComponents/Content";
import Navbar from './Navbar';
import Post from './Post';
import { useLocation } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import loading from "../img/loading.svg";
import TrendingBar from "./TrendingBar";
import CreatePosts from "./CreatePosts";
import useInterval from "react-useinterval";
import { ContainerModal,Modal } from '../styledComponents/Content';


export default function Timeline() {
    const { user, setUser, followingUsers, setFollowingUsers } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [afterLoading, setAfterLoading] = useState(null);
    const location = useLocation();
    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [modal, setModal] = useState(false);
    const [link, setLink ] = useState("");

    useEffect(() => {
        checkFollowingUsers();
    }, []);

    function checkFollowingUsers() {
        setPosts([]);
        setAfterLoading(null);
        setIsError(false);
        setIsLoading(true);
        const request = axios.get(
            "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows",
            config
        );

        request.then((response) => {
            setFollowingUsers(response.data.users);
            setUser(localStorage.user);
            loadingPosts();
        });

        request.catch(() => {
            setIsError(true);
            setIsLoading(false);
        });
    }

    function loadingPosts() {
        setPosts([]);
        setAfterLoading(null);
        setIsError(false);
        const request = axios.get(
            "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/following/posts",
            config
        );

        request.then((response) => {
            setPosts(response.data.posts);
            setIsLoading(false);
            if (posts.length === 0 && followingUsers.length !== 0) {
                setAfterLoading(<Load>Nenhuma publicação encontrada</Load>);
            } else if (posts.length === 0 && followingUsers.length === 0) {
                setAfterLoading(<Load>Você não segue ninguém ainda, procure por perfis na busca</Load>)
            } 
        })

        request.catch(() => {
            setIsError(true);
            setIsLoading(false);
        });
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

    useInterval(checkFollowingUsers, 100000);

    return (
        <>
            <Navbar />
            <Container>
                <PageTitle>
                    <h1>timeline</h1>
                </PageTitle>
                <div>
                    <Posts>
                        <CreatePosts loadingPosts = {loadingPosts}/>
                        { isLoading ? <Load><div><img src={loading} alt="Loading"/>Loading...</div></Load>  : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { (posts.length === 0 && afterLoading === null) || posts.length !== 0 ? "" : afterLoading}
                        {posts.map( post => 
                            <Post 
                                key={post.id} id={post.id} post={post} 
                                postUser={post.user} likes={post.likes}
                                reloadingPosts={loadingPosts}
                                location={location}
                                OpenModal={OpenModal}
                            />
                        )}
                    </Posts>
                    <Trending>
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
    );
}

