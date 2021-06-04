import { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import ReactHashtag from "react-hashtag";
import { FiHeart } from "react-icons/fi";
import { FaHeart} from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import {FaMapMarkerAlt} from "react-icons/fa";

import { confirmAlert } from "react-confirm-alert";
import "../styles/react-confirm-alert.css";
import Comments from './Comments';
import { AiOutlineComment } from 'react-icons/ai';
import linkrLogo from '../img/linkrLogo.JPG';
import { BiRepost } from 'react-icons/bi'

import UserContext from "../contexts/UserContext";
import ModalMap from "./ModalMap";

export default function Post({
  post,
  id,
  postUser,
  likes,
  reloadingPosts,
  loadMyPosts,
  location,
  OpenModal
}) {
  const [peopleThatLiked, setPeopleThatLiked] = useState(likes);
  const [likeQuantity, setLikeQuantity] = useState(likes.length);
  const [like, setLike] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const localstorage = JSON.parse(localStorage.user);
  const token = localstorage.token;
  const [controler, setControler] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const inputRefText = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showComments, setShowComments] = useState(false)
  const [locationOfPost, setLocationOfPost] = useState({});
  const[openMaps, setOpenMaps] = useState(false);

  useEffect(() => {
    likes.some(
      (like) =>
        like.userId === localstorage.user.id || like.id === localstorage.user.id
    )
      ? setLike(1)
      : setLike(0);
  }, []);

  function ViewLocation(){
    setOpenMaps(true);
    };

  function likePost(config) {
    const request = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/like`,
      {},
      config
    );
    request.then((response) => {
      setUser(localStorage.user);
      setLike(1);
      setLikeQuantity(response.data.post.likes.length);
      setPeopleThatLiked([
        ...peopleThatLiked,
        { "user.username": localstorage.user.username },
      ]);
    });
    request.catch(() => {
      alert(
        "Há uma instabilidade no servidor, tente novamente em alguns minutos"
      );
    });
  }

  function dislikePost(config) {
    const request = axios.post(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/dislike`,
      {},
      config
    );
    request.then((response) => {
      setUser(localStorage.user);
      setLike(0);
      setLikeQuantity(response.data.post.likes.length);
      const storePeopleThatLiked = peopleThatLiked.filter(
        (name) => name["user.username"] !== localstorage.user.username
      );
      setPeopleThatLiked(storePeopleThatLiked);
    });
    request.catch(() => {
      alert(
        "Há uma instabilidade no servidor, tente novamente em alguns minutos"
      );
    });
  }

  function toggleLike() {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    like === 0 ? likePost(config) : dislikePost(config);
  }

  function deletePost() {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const request = axios.delete(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${post.user.id}`,
      config
    );
    request.then(() => {
      setUser(localStorage.user);
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
      setIsEdit(false);
    }
    else {setEditText(post.text);
           }
  }, [controler]);

  function Edit(event) {
    event.preventDefault();
    const body = {
      text: editText,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const request = axios.put(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}`,
      body,
      config
    );
   
    request.then((response) => {
      setControler(false);
      setIsEdit(true);
      setEditText(response.data.post.text)
      
    });

    request.catch(() => {

      alert("Não foi possível salvar as alterações");
    });
  }


  function keydowm(e){
    e.keyCode === 27 && setControler(false);
  }

  function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }
  let srcYoutube;
  if(post.link){
    srcYoutube = "https://www.youtube.com/embed/"+getId(post.link)+"?mute=1"
  }
 
  function toggleComments() {
    setShowComments(!showComments)
  }

  function ViewLocation(){
    setOpenMaps(true);
    request.then(reloadingPosts)
    

  }

  return (
    <>
    {post.hasOwnProperty('repostedBy')
    ? <RepostContainer>
        <RespostIcon className="RepostBar"></RespostIcon>
        <p>re-posted by <span>{localstorage.user.id===post.repostedBy['id']?'You':post.repostedBy['username']}</span></p>
      </RepostContainer>
    : ""
    }
    <PostContainer key={postUser.id}>
      <Profile>
        <Link to={`/user/${postUser.id}`}>
          <Image avatar={postUser.avatar}></Image>
        </Link>
        <div>
          {like === 1 ? (
            <HeartIconFill className="button" onClick={toggleLike} />
          ) : (
            <HeartIconEmpty className="button" onClick={toggleLike} />
          )}
          <Tooltip
            content={
              peopleThatLiked.length > 0 ? (
                <span>
                  {peopleThatLiked.map((name, i) => {
                    if (i < 2) {
                      if (i === 0)
                        return (
                          <p>{like === 1 ? "Você" : name["user.username"]}</p>
                        );
                      if (i === 1)
                        return (
                          <p>
                            {peopleThatLiked.length === 2 ? `\u00A0 e ` : ","}{" "}
                            {name["user.username"]}{" "}
                          </p>
                        );
                    }
                  })}
                  <p>
                    {" "}
                    {"\u00A0"}
                    {`${
                      peopleThatLiked.length >= 4
                        ? `e outras ${
                            peopleThatLiked.length - 2
                          } pessoas curtiram este post`
                        : `${
                            peopleThatLiked.length === 3
                              ? `e mais uma pessoa curtiram este post`
                              : `${
                                  peopleThatLiked.length === 2
                                    ? `curtiram este post`
                                    : `${
                                        peopleThatLiked.length === 1
                                          ? `curtiu este post`
                                          : ""
                                      }`
                                }`
                          }`
                    }`}
                  </p>
                </span>
              ) : (
                "Nenhuma curtida até o momento"
              )
            }
            interactive={true}
            placement='bottom'
            arrow={true}>
            <p>
              {likeQuantity} {likeQuantity === 1 ? "like" : "likes"}
            </p>
          </Tooltip>
        </div>
        <div>
          <CommentIcon className="button" onClick={toggleComments}/>
          <p>{post.commentCount} comments</p>
        </div>
        <div>
          <RespostIcon className="button" onClick={DoYouWannaRepost}/>
          <p>{post.repostCount} re-posts</p>
        </div>
      </Profile>
      <Content>
        <div class='boxName'>
          <div>
            <Link to={`/user/${postUser.id}`}>
            <h2>{postUser.username}</h2>
            </Link>
            {post.geolocation ? <FaMapMarkerAlt className='map-icon' onClick={ViewLocation}/>
            : ""}
            {openMaps? <ModalMap  openMaps={openMaps} setOpenMaps={setOpenMaps} post={post}/> : ""}
          </div>
          { post.hasOwnProperty('repostedBy') || <div class='icons'>
            {post.user.id === localstorage.user.id ? (
              <FaPencilAlt onClick={ShowEdit} className='pencil-icon' />
            ) : (
              ""
            )}
            {post.user.id === localstorage.user.id ? (
              <FaTrashAlt
                id={id}
                className='trash-icon'
                onClick={moveToTrash}
              />
            ) : (
              ""
            )}{" "}
          </div>}
        </div>
        <div className='teste'>
            {controler ? (
              <form onSubmit={Edit}>
                <input
                  type='text'
                  required
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  ref={inputRefText}
                  onKeyDown={(e) => keydowm(e)}
                />
              </form>
            ) : (
              <p>
                <ReactHashtag
                  renderHashtag={(hashtagValue) => (
                    <Link to={`/hashtag/${hashtagValue}`.replace("#", "")}>
                      <Hashtag>{hashtagValue}</Hashtag>
                    </Link>
                  )}>
                  {isEdit ? editText : post.text}
                </ReactHashtag>
              </p>
            )}
          </div>
          {post.link.includes("youtube.com/watch") ||
          post.link.includes("youtu.be/") ? (
            <YoutubePlayer>
              <iframe width='502' height='281' src={srcYoutube}></iframe>
              <p>{post.link}</p>
            </YoutubePlayer>
          ) : (
            <LinkSnippet href={post.link} target={"_blank"}>
              <Text>
                <h2>{post.linkTitle}</h2>
                <p>{post.linkDescription}</p>
                <div>
                  <p>{post.link}</p>
                </div>
              </Text>
              <img src={post.linkImage || linkrLogo} alt='website' />
            </LinkSnippet>
          )}
      </Content>
    </PostContainer>
    {showComments ? <Comments id={id} postUser={post.user} /> : null}
    </>
  );
          }

const RepostContainer = styled.div`
  height: 44px;
  display: flex;
  position: relative;
  top:12px;
  justify-content: flex-start;
  align-items: center;
  border-radius: 16px 16px 0 0;
  background-color:#1E1E1E;
  
  .RepostBar{
    cursor: default;
    margin-left: 24px;
    margin-bottom: 10px;
  }

  p{
    font-size:11px;
    margin-left: 6px;
    color: #FFF;
    margin-bottom: 10px;

    span{
      font-weight: bold;
    }
  }
`

const YoutubePlayer = styled.div`
  display: flex;
  flex-direction: column;
  iframe{
    margin-top: 8px;
    margin-bottom: 8px;
  }
  @media (max-width: 611px) {
      width: 100%;
      iframe{
        width:100%;
        height:100%;
      }
    }
`

const PostContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 400;
  padding: 18px 18px 20px 21px;
  background: #171717;
  margin-bottom: 16px;
  border-radius: 16px;
  position: relative;
  z-index:0;

  .button:focus,
.button:hover {   
  filter: brightness(700%);
  animation: pulse 1s;
  opacity: 0.8;

}
  @media (max-width: 611px) {
    border-radius: 0;
    padding: 9px 18px 15px 15px;
    height: 232px;
  }
  .map-icon{
    color:white;
    margin-left:10px;
    font-size:16px;
  }
`;
const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 85px;
  padding-right: 10px;
  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  p {
    color: #fff;
    font-size: 12px;
    margin-top:8px;
  }
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top : 18px;

  }
  @media (max-width: 611px) {
    height: 130px;
    margin-left: -6px;
    img {
      width: 40px;
      height: 40px;
    }
    p {
      font-size: 9px;
    }
    >div{
      height:28px;
      width: 55px;
    }
  }
`;
const Image = styled.div`
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background: url("${props => props.avatar}");
    background-size: cover;
    background-position: center;
`;
const Content = styled.div`
  width: 503px;
  height: 100%;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  font-weight: bold;
  text-overflow: ellipsis;
  .teste {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 23px;
    margin-bottom: 1.5px;

    form{
      width:100%;
    }
    > h2 {
      color: #fff;
      font-size: 19px;
      text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    }
    > p {
      font-size: 17px;
      line-height: 23px;
      color: #b7b7b7;
      max-height: 70px;
      margin-top: 19px;
      margin-bottom: 14px;
      text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    }
  }
  .boxName {
    display: flex;
    justify-content: space-between;
    width: 100%;
    
    .map-icon{
      cursor: pointer;
    color:white;
    margin-left:10px;
    font-size:16px;
  }
    @media (max-width: 611px) {
      width: 100%;
    }
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
    line-height: 23px;
    color: #b7b7b7;
    max-height: 70px;
    margin-top: 19px;
    margin-bottom: 14px;
  }
  div {
    color: white;
    display: flex;
  }
  input {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 23px;
    border-radius: 7px;
    padding: 0px 5px;
    color: #4c4c4c;
    background-color: #ffff;
    outline: none;
    border: none;
    margin-top: 19px;
    margin-bottom: 14px;
    font-weight: bold;
    font-size: 17px;
    line-height: 23px;
  }

  @media (max-width: 611px) {
    width: 100%;
    > h2 {
      font-size: 16px;
    }
    > p {
      font-size: 14px;
      line-height: 16px;
      h2 {
        color: #fff;
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
      > div p {
        font-size: 15px;
        line-height: 20px;
        color: #b7b7b7;
      }
      @media (max-width: 611px) {
        width: 82%;
        > h2 {
          font-size: 16px;
        }
        > p {
          font-size: 14px;
          line-height: 16px;
        }
      }
    }
  }
`;
const LinkSnippet = styled.div`
  border-radius: 11px;
  border: 1px solid #4d4d4d;
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

  &:hover{
    cursor:pointer;
  }
  img:before{
    content: ' ';
    border-top-right-radius: 11px;
    border-bottom-right-radius: 11px;
    height: 100%;
    width: 154px;
    background-image: url(${linkrLogo});
    object-fit: cover;
    background-position: center;
  }
  @media (max-width: 611px) {
    height: 115px;
    img {
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
  //overflow-y: scroll;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
> h2 {
    font-size: 16px;
    color: #cecece;
    margin-bottom: 10px;
    text-overflow: ellipsis;
    //overflow: hidden;
    //white-space: nowrap;
  }

   /* display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden; */

> p {
    color: #9b9595;
    font-size: 11px;
    line-height: 15px;
    margin-bottom: 15px;
  }
> div {
    width: 100%;
  }
> div p {
    color: #cecece;
    font-size: 11px;
  }
  @-moz-document url-prefix() { 
    overflow:hidden;
    p,h2{
      word-break: break-word !important;
    }
  }
  @media (max-width: 611px) {
    width: 67%;
    h2 {
      margin-top: 5px;
      font-size: 11px;
      line-height: 13px;
    }
    p {
      font-size: 9px;
      line-height: 9px;
    }
    div {
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
  font-size: 21px;
  color: #fff;
  cursor: pointer;
`;

const HeartIconFill = styled(FaHeart)`
  font-size: 21px;
  color: #ac0000;
  cursor: pointer;
`;

const Hashtag = styled.span`
  color: #fff;
  font-size: 19px;
  line-height: 23px;
`;

const CommentIcon = styled(AiOutlineComment)`
  font-size: 22px;
  color: #fff;
  cursor: pointer;
`
const RespostIcon = styled(BiRepost)`
  font-size: 23px;
  color: #fff;
  cursor: pointer;
`

const Tooltip = styled(Tippy)`
  background: #ebebeb !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  line-height: 14px !important;
  color: #505050 !important;
  display: flex !important;
  span {
    width: 100%;
    display: flex;
  }
  p {
    color: #505050 !important;
  }
  .tippy-arrow {
    color: #ebebeb !important;
  }
`;