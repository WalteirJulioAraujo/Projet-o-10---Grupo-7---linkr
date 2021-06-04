import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Posts, Trending, Load, PageTitle, ContainerModal, Modal } from "../styledComponents/Content";
import InfiniteScroll from 'react-infinite-scroller';
import styled from "styled-components";
import Navbar from "./Navbar";
import Usercontext from "../contexts/UserContext";
import TrendingBar from "./TrendingBar";
import Post from "./Post";
import useInterval from 'react-useinterval';
import loading from '../img/loading.svg'

export default function User() {
    const { user, setUser } = useContext(Usercontext);
    const { id } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [afterLoading, setAfterLoading] = useState(null)
    const [hasMorePosts, setHasMorePosts] = useState(false)
    const [followList, setFollowList] = useState([]);
    const [userInfo, setUserInfo] = useState(undefined);
    const [disabled, setDisabled] = useState(false);

    const [modal, setModal] = useState(false);
    const [link, setLink ] = useState("");

    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        loadingUser();
        loadingPostsUser();
        FollowList();
    }, []);


    function username() {
        return userInfo.username + "'s posts";
    }

    function loadingPostsUser() {
        setIsLoading(true);
        setIsError(false);
        const request = axios.get(
            `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${id}/posts`,
            config
        );

        request.then((response) => {
            setUser(localStorage.user);
            const data = response.data.posts 
            setUserPosts(response.data.posts)
            setIsLoading(false)
            setHasMorePosts(true) 
            if(data.length === 0){
                setAfterLoading(<Load>Nenhuma publicação encontrada</Load>)
                return
            } 
        });

        request.catch(() => {
            setIsError(true);
            setIsLoading(false);
        });
    }

    function FollowList() {
        const request = axios.get(
            "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows",
            config
        );
        request.then((e) => {
            const idList = e.data.users.map((e) => e.id);
            setFollowList(idList);
        });
    }


    function loadingUser() {
        const request = axios.get(
            `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${id}`,
            config
        );
        request.then((e) => {
            setUserInfo(e.data.user);
        });
    }

    function FollowUnfollow() {
        setDisabled(true);
        const follow = followList.includes(userInfo.id) ? "unfollow" : "follow";
        const request = axios.post(
            `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${userInfo.id}/${follow}`,
            {},
            config
        );
        request.then(() => {
            FollowList();
            setDisabled(false);
        });
        request.catch(() => {
            alert("Não foi possível executar a operação");
            setDisabled(false);
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

    function updatePosts(){
        setIsError(false)
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${id}/posts?earlierThan=${userPosts[0].id}`,config)
        
        request.then( response => {
            if(response.data.posts !== undefined){
                setUserPosts([...response.data.posts, ...userPosts]);
            } 
        })
        request.catch( () => {setIsError(true); setIsLoading(false); setHasMorePosts(false)})
    }

    function fetchPosts(){
        if(userPosts.length > 200){
            setHasMorePosts(false)
            return
        }

        if(userPosts.length !== 0){
            const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${id}/posts?olderThan=${userPosts[userPosts.length - 1].id}`, config)

            request.then( response => {
                if(response.data.posts.length < 10){
                    setHasMorePosts(false)
                } 
                setTimeout(() => setUserPosts([...userPosts,...response.data.posts]),1000)
            })

            request.catch( () => {setIsError(true); setIsLoading(false); setHasMorePosts(false)})
        }
    }
    useInterval(updatePosts, 15000);
    
    return (

        <>
            <Navbar />
            <Container>
                <PageTitle>
                    {!userInfo ? (
                        ""
                    ) : (
                        <>
                            <Title avatar={userInfo.avatar}>
                                {userInfo ? (
                                    <div></div>
                                ) : (
                                    ""
                                )}
                                <div><h1>{userInfo ? username() : ""}</h1></div>
                            </Title>
                            {userInfo.id === localstorage.user.id ? (
                                ""
                            ) : (
                                <Button
                                    follow={
                                        userInfo
                                            ? followList.includes(userInfo.id)
                                            : false
                                    }
                                    onClick={FollowUnfollow}
                                    disabled={disabled}
                                >
                                    {" "}
                                    {userInfo
                                        ? followList.includes(userInfo.id)
                                            ? "Unfollow"
                                            : "Follow"
                                        : "Follow"}{" "}
                                </Button>
                            )}
                        </>
                    )}
                </PageTitle>
                <div>
                    <Posts>
                        { isLoading ? <Load><div><img src={loading} alt="Loading"/>Loading...</div></Load>  : ""}
                        { isError ? <Load>Houve uma falha ao obter os posts, <br/> por favor atualize a página</Load> : ""}
                        { userPosts === undefined || (userPosts.length === 0 && afterLoading === null) || userPosts.length !== 0 ? "" : afterLoading}
                        <InfiniteScroll pageStart={0} loader={<Load><div><img src={loading}/>Loading more posts...</div></Load> } hasMore={hasMorePosts} loadMore={fetchPosts}>
                        {userPosts.map((post) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                post={post}
                                postUser={post.user}
                                likes={post.likes}
                                OpenModal={OpenModal}
                            />
                        ))}
                        </InfiniteScroll>
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

const Title = styled.div`
    width: 85%;
    display: flex;
    justify-content: flex-start !important;
    align-items: center;
    div:first-child {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: url("${props => props.avatar}");
        background-size: cover;
        background-position: center;
    }
    div:last-child{
        margin-left: 18px;
        width: 80%;
        display: flex;
        align-items: center;
        padding-bottom: 12px;
    }
    @media(max-width: 611px){
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        width: 100%;
        div:first-child {
            margin-top: 2px;
            margin-left: 5px;
        }
        div:last-child{
        margin-left: 25px;
        width: 70%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 12px;
        }
        h1 {
            word-break: break-word;
        }
    }

    @media (max-width: 611px){
        width: 80%;

        img {
           display: none;
        }
    }
`;
const Button = styled.button`
    width: 112px;
    height: 31px;
    border: none;
    border-radius: 5px;
    background-color: ${(props) => (props.follow ? "#FFF" : "#1877F2")};
    color: ${(props) => (props.follow ? "#1877F2" : "#FFF")};
    font-size: 14px;
    font-weight: 700;

    &:hover{
        cursor:pointer;
    }
    @media(max-width: 611px){
        position: absolute;
        top: 60px;
        left: 17.5px;
        width: 58px;
        height: 17px;
        font-size: 10px;
    }
`;
