import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components'
import ReactHashtag from "react-hashtag";
import {FiHeart} from 'react-icons/fi';
import {FaHeart} from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import UserContext from "../contexts/UserContext";

export default function Post({post, id, postUser, likes}) {

    const [likeQuantity, setLikeQuantity] = useState(likes.length);
    const [like, setLike] = useState(0);
    //const { user } = useContext(UserContext);
    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        likes.some(like => like.userId === user.user.id || like.id === user.user.id) ? setLike(1) : setLike(0);
    },[]);

     function likePost(config) {
        const request = axios.post(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/like`, {}, config);
        request.then(response => {
            setLike(1);
            setLikeQuantity(response.data.post.likes.length);
        });
        request.catch(() => {
            alert("Há uma instabilidade no servidor, tente novamente em alguns minutos");
        });
    }

    function dislikePost(config) {
        const request = axios.post(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/dislike`, {}, config);
        request.then(response => {
            setLike(0);
            setLikeQuantity(response.data.post.likes.length);
        });
        request.catch(() => {
            alert("Há uma instabilidade no servidor, tente novamente em alguns minutos");
        });
    }

    function toggleLike() {
        const config = { 
            headers:{ 
                Authorization: `Bearer ${user.token}`
            }
        };
        like === 0 ? likePost(config) : dislikePost(config); 
    }

    return (
        <PostContainer key={postUser.id}>
            <Profile>
                <Link to={`/user/${postUser.id}`}><img src={postUser.avatar} alt={`${postUser.username}' profile`}/></Link>
                <div>
                    {like === 1 ? 
                        <HeartIconFill onClick={toggleLike} /> :
                        <HeartIconEmpty onClick={toggleLike}/>
                    }
                    <Tooltip 
                        content="Cristiano, Marcelo e outras 11 pessoas" 
                        interactive={true} placement="bottom"
                    >
                        <p>{likeQuantity} {likeQuantity === 1 ? "like": "likes"}</p>
                    </Tooltip>
                </div>
            </Profile>
            <Content>
                <h2>{postUser.username}</h2>
                <p>
                <ReactHashtag renderHashtag={(hashtagValue) => (
                    <Link to={`/hashtag/${hashtagValue}`.replace("#","")}>
                       <Hashtag>{hashtagValue}</Hashtag>
                    </Link>)}>
                    {post.text} 
                </ReactHashtag>
                </p>
                <LinkSnippet href={post.link} target={"_blank"}>
                    <Text>
                        <h2>{post.linkTitle}</h2>
                        <p>{post.linkDescription}</p>
                        <div>{post.link}</div>
                    </Text>
                    <img src={post.linkImage} alt="website" />
                </LinkSnippet>
            </Content>
        </PostContainer>
    )
}

const PostContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 276px;
    width: 100%;
    font-weight: 400;
    padding: 18px 18px 20px 21px;
    background: #171717;
    border-radius: 16px;
    margin-bottom: 16px;   
`;
const Profile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 104px;
    
    img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
    p{
        color: #FFF;
        font-size: 11px;
    }
    > div {
        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content: space-between;
        height: 35px;
    }
`;
const Content = styled.div`
    width: 503px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    >h2{
        color: #FFF;
        font-size: 19px;
    }
    >p{
        font-size: 17px;
        color: #B7B7B7;
    }
`;
const LinkSnippet = styled.a`
    border-radius: 11px;
    border: 1px solid #4D4D4D;
    height: 155px;
    display: flex;
    justify-content: space-between;
    word-wrap: break-word;
    overflow: hidden;
    img {
        border-top-right-radius: 11px;
        border-bottom-right-radius: 11px;
        height: 100%;
        width: 154px;
    }
`;
const Text = styled.div`
    margin: 23px 27px 23px 19px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    h2{
        font-size: 16px;
        color: #CECECE;
    }
    p{
        color: #9B9595;
        font-size: 11px;
        line-height: 12px;
    }
    div {
        color: #CECECE;
        font-size: 11px;
    }
`;

const HeartIconEmpty = styled(FiHeart)`
    font-size: 18px;
    color: #fff;
    cursor: pointer;
`;

const HeartIconFill = styled(FaHeart)`
    font-size: 18px;
    color: #AC0000;
    cursor: pointer;
`;

const Hashtag = styled.span`
    color: #FFF;
    font-weight: 700;
`;

const Tooltip = styled(Tippy)`
    background: #ebebeb !important;
    font-weight: 700 !important;
    font-size: 12px !important;
    line-height: 14px !important;
    color: #505050 !important;
    /* data-placement^=top */

    .tippy-arrow {
        color: #ebebeb !important;
    }

    .tippy-box[data-placement^=bottom] {
        
    }

    .tippy-content {
        /* padding-bottom: 5px !important; */
    }
`;