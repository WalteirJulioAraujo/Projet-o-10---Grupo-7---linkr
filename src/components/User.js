import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Posts, Trending, Load } from "../styledComponents/Content";

import styled from "styled-components";
import Navbar from "./Navbar";
import Usercontext from "../contexts/UserContext";
import TrendingBar from "./TrendingBar";
import Post from "./Post";
import useInterval from 'react-useinterval';

export default function User() {
    const { user, setUser } = useContext(Usercontext);
    const { id } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [followList, setFollowList] = useState([]);
    const [userInfo, setUserInfo] = useState(undefined);
    const [disabled, setDisabled] = useState(false);

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
            const data = response.data.posts;
            setUserPosts([...response.data.posts]);
            setIsLoading(false);
            if (userPosts === data) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }
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

    useInterval(loadingPostsUser, 15000);
    
    return (

        <>
            <Navbar />
            <Container>
                <TitleContainer>
                    {!userInfo ? (
                        "Loading"
                    ) : (
                        <>
                            <Title>
                                {userInfo ? (
                                    <img
                                        src={`${userInfo.avatar}`}
                                        alt={`${userInfo.username} profile`}
                                    />
                                ) : (
                                    ""
                                )}
                                <h1>{userInfo ? username() : ""}</h1>
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
                </TitleContainer>
                <div>
                    <Posts>
                        {isLoading ? <Load>Loading</Load> : ""}
                        {isError ? (
                            <Load>
                                Houve uma falha ao obter os posts, <br /> por
                                favor atualize a página
                            </Load>
                        ) : (
                            ""
                        )}
                        {isEmpty && !isLoading ? (
                            <Load>Nenhum post encontrado</Load>
                        ) : (
                            ""
                        )}
                        {userPosts.map((post) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                post={post}
                                postUser={post.user}
                                likes={post.likes}
                            />
                        ))}
                    </Posts>
                    <Trending>
                        <TrendingBar />
                    </Trending>
                </div>
            </Container>
        </>
    );
}

const TitleContainer = styled.div`
    align-items: center !important;
`;
const Title = styled.div`
    display: flex;
    justify-content: flex-start !important;
    align-items: center !important;
    img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 18px;
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
`;
