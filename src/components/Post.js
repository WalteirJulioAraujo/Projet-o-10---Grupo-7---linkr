import { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import ReactHashtag from "react-hashtag";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "../styles/react-confirm-alert.css";

import UserContext from "../contexts/UserContext";

export default function Post({
  post,
  id,
  postUser,
  likes,
  reloadingPosts,
  loadMyPosts,
  location,
}) {
    
  const [peopleThatLiked, setPeopleThatLiked] = useState(likes);
  const [likeQuantity, setLikeQuantity] = useState(likes.length);
  const [like, setLike] = useState(0);
  const { user } = useContext(UserContext);
  const [controler, setControler] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const inputRefText = useRef();
  let history = useHistory();

  useEffect(() => {
    likes.some(like => like.userId === user.user.id || like.id === user.user.id) ? setLike(1) : setLike(0);
},[]);

function likePost(config) {
    const request = axios.post(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/like`, {}, config);
    request.then(response => {
        setLike(1);
        setLikeQuantity(response.data.post.likes.length);
        setPeopleThatLiked([...peopleThatLiked, {"user.username": user.user.username}]);
    });
    request.catch(() => {
        alert("Há uma instabilidade no servidor, tente novamente em alguns minutos");
    });
};

function dislikePost(config) {
    const request = axios.post(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/dislike`, {}, config);
    request.then(response => {
        setLike(0);
        setLikeQuantity(response.data.post.likes.length);
        const teste = peopleThatLiked.filter(name => name['user.username'] !== user.user.username);
        setPeopleThatLiked(teste);
    });
    request.catch(() => {
        alert("Há uma instabilidade no servidor, tente novamente em alguns minutos");
    });
};

function toggleLike() {
    const config = { 
        headers:{ 
            Authorization: `Bearer ${user.token}`
        }
    };
    like === 0 ? likePost(config) : dislikePost(config); 
}; 


  function ShowEdit() {
    if (controler) {
      setControler(false);
      return;
    } else {
      setControler(true);
    }
  }

  useEffect(() => {
    if (controler) {
      inputRefText.current.focus();
    }
    setEditText(post.text);
  }, [controler]);

  function Edit(event) {
    event.preventDefault();

    const body = {
      text: editText,
    };
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const request = axios.put(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}`,
      body,
      config
    );
    request.then((response) => {
      setControler(false);
      reloadingPosts();

    });
    request.catch(() => {
      alert("Não foi possível salvar as alterações");
    });
  }

  function deletePost() {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const request = axios.delete(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${post.id}`,
      config
    );
    request.then(() => {
      alert("sucess");
      if (location.pathname === "/timeline") {
        reloadingPosts();
      } else if (location.pathname === "/my-posts") {
        loadMyPosts();
      }
    });
    request.catch(() => {
      alert("Não foi possível excluir o post");
    });
  }

  function moveToTrash() {
    confirmAlert({
      message: "Tem certeza que deseja excluir essa publicação?",
      buttons: [
        {
          label: "Sim, excluir",
          onClick: () => deletePost(),
          className: "yes",
        },
        {
          label: "Não, voltar",
        },
      ],
      closeOnClickOutside: false,
    });
  }

  return (
    <PostContainer key={postUser.id}>
      <Profile>
                <Link to={`/user/${postUser.id}`}>
                    <img src={postUser.avatar} alt={`${postUser.username}' profile`}/>
                </Link>
                <div>
                    {like === 1 ? 
                        <HeartIconFill onClick={toggleLike} /> :
                        <HeartIconEmpty onClick={toggleLike}/>
                    }
                    <Tooltip 
                        content={peopleThatLiked.length > 0 ? 
                            <span>
                                {peopleThatLiked.map((name, i) => {
                                if(i < 2) {
                                    if(i === 0) return <p>{like === 1 ? "Você" : name['user.username']}</p>
                                    if(i === 1) return <p>{peopleThatLiked.length === 2 ? `\u00A0 e ` : ","} {name['user.username']} </p>
                                }
                                })}
                                <p> {'\u00A0'}{`${peopleThatLiked.length >= 4 ? `e outras ${peopleThatLiked.length - 2} pessoas curtiram este post` : 
                                    `${peopleThatLiked.length === 3 ? `e mais uma pessoa curtiram este post` : 
                                    `${peopleThatLiked.length === 2 ? `curtiram este post` : 
                                    `${peopleThatLiked.length === 1 ? `curtiu este post` : ""}`}`}`}`}
                                </p>
                            </span> 
                            : "Nenhuma curtida até o momento"}                        
                        interactive={true} placement="bottom" arrow={true}
                    >
                        <p>{likeQuantity} {likeQuantity === 1 ? "like": "likes"}</p>
                    </Tooltip>
                </div>
            </Profile>
      <Content>
        <div class='boxName'>
         <Link to={`/user/${postUser.id}`}>
                    <h2>{postUser.username}</h2>
         </Link>
          <div class='icons'>
            {post.user.id === user.user.id ? (
              <FaPencilAlt onClick={ShowEdit} className='pencil-icon' />
            ) : (
              ""
            )}
            {post.user.id === user.user.id ? (
              <FaTrashAlt
                id={id}
                className='trash-icon'
                onClick={moveToTrash}
              />
            ) : (
              ""
            )}{" "}
          </div>
        </div>

        <p>
          <ReactHashtag
            renderHashtag={(hashtagValue) => (
              <Link to={`/hashtag/${hashtagValue}`.replace("#", "")}>
                <Hashtag>{hashtagValue}</Hashtag>
              </Link>
            )}>
            {controler
              ? [
                  <form onSubmit={Edit}>
                    <input
                      type='text'
                      required
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      ref={inputRefText}
                    />
                  </form>,
                ]
              : post.text}
          </ReactHashtag>
        </p>
        <LinkSnippet href={post.link} target={"_blank"}>
                    <Text>
                        <h2>{post.linkTitle}</h2>
                        <p>{post.linkDescription}</p>
                        <div><p>{post.link}</p></div>
                    </Text>
                    <img src={post.linkImage} alt="website" />
            </LinkSnippet>
      </Content>
    </PostContainer>
  );
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
    @media(max-width: 611px){
        border-radius: 0;
        padding: 9px 18px 15px 15px;
        height: 232px;
    }   
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
  p {
    color: #fff;
    font-size: 11px;
  }
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 35px;
  }

  @media (max-width: 611px) {
    height: 97px;
    img {
      width: 40px;
      height: 40px;
    }
    p {
      font-size: 9px;
    }
  }
`;
const Content = styled.div`
  width: 503px;
    height: 100%;
    padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  .boxName {
    display: flex;
    justify-content: space-between;
    width: 502px;
  }
  .pencil-icon {
    color: #ffffff;
    width: 14px;
    height: 14px;
    cursor: pointer;
    margin-left: 15px;
  }
  > h2 {
    color: #fff;
    font-size: 19px;
  }
  > p {
    font-size: 17px;
    color: #b7b7b7;
  }

  div {
    color: white;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: 7px;
    font-size: 14px;
    padding: 4px 9px;
    outline: 1px solid black;
    overflow-y: auto;
    overflow-wrap: break-word;
    color: #4c4c4c;
  }

  @media (max-width: 611px) {
    width: 82%;
    > h2 {
      font-size: 16px;
    }
    > p {
      font-size: 14px;
      line-height: 16px;
    h2{
        color: #FFF;
        font-size: 19px;
    }
    > div {
        width: 100%;
        max-width: 502px;
        max-height: 52px;
        display: flex; 
        flex-wrap: wrap;
        overflow-x: hidden;
    }
    > div p{
        font-size: 15px;
        line-height: 20px;
        color: #B7B7B7;
    }
    @media (max-width: 611px){
        width: 82%;
        >h2{
            font-size: 16px;
        }
        >p{
            font-size: 14px;
            line-height: 16px;
        }
    }}}
`;
const LinkSnippet = styled.a`
    border-radius: 11px;
    border: 1px solid #4D4D4D;
    height: 155px;
    display: flex;
    justify-content: space-between;

    img {
        border-top-right-radius: 11px;
        border-bottom-right-radius: 11px;
        height: 100%;
        width: 154px;
        object-fit: cover;
        background-position: center;
    }
    @media (max-width:611px){
        height: 115px;
        img{
            width: 33%;
        }
    }
`;
const Text = styled.div`
    padding: 10px;
    height: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: scroll;
    > h2{        
        font-size: 16px;
        color: #CECECE;
        margin-bottom: 10px;
    }
    > p{
        color: #9B9595;
        font-size: 11px;
        line-height: 15px;
        margin-bottom: 15px;
    }
    > div {
        width: 100%;
    }
    > div p {
        color: #CECECE;
        font-size: 11px;
    }
    @media (max-width: 611px){
        width:67%;
        h2{
            margin-top: 5px;
            font-size: 11px;
            line-height: 13px;
        }
        p{
            font-size: 9px;
            line-height: 9px;
        }
        div{
            font-size: 9px;
            line-height: 9px;
        }
    
  }
`;

const FaTrashAlt = styled(FaTrash)`
  color: #ffffff;
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 10px;
`;
const HeartIconEmpty = styled(FiHeart)`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
`;

const HeartIconFill = styled(FaHeart)`
  font-size: 18px;
  color: #ac0000;
  cursor: pointer;
`;

const Hashtag = styled.span`
  color: #fff;
  font-weight: 700;
`;

const Tooltip = styled(Tippy)`
    background: #ebebeb !important;
    font-weight: 700 !important;
    font-size: 12px !important;
    line-height: 14px !important;
    color: #505050 !important;
    display: flex !important;
    
    span{
        width: 100%;
        display: flex;

    }

    p{
        color: #505050 !important;
    }

    .tippy-arrow {
        color: #ebebeb !important;
    }
`;
