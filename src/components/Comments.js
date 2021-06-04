import axios from 'axios'
import { useState, useContext, useEffect } from 'react';
import ReactHashtag from "react-hashtag";
import { Link } from 'react-router-dom'
import UserContext from "../contexts/UserContext";
import styled from 'styled-components'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { GoPrimitiveDot } from 'react-icons/go'

export default function Comments({id, postUser}) {
    const {followingUsers} = useContext(UserContext);
    const [comments, setComments] = useState([])
    const [show, setShow] = useState(false)
    const [text, setText] = useState("")
    const [showMore, setShowMore] = useState(true)
    const [list, setList] = useState([])
    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const config = { headers:{ Authorization: `Bearer ${token}`}};
    const limit = 3
    const [index, setIndex] = useState(limit)

    useEffect( () => loadingComments(""),[])
   
    function loadingComments(param) {
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/comments`, config)

        request.then( response  => {
            const data = response.data.comments
            data.map( comment => {
                followingUsers.forEach( follow => {
                    if(comment.user.id === follow.id){
                        comment.who = "following"
                        return
                    }
                })
                if(comment.user.id === postUser.id){
                    comment.who = "post's author"
                }
            })
            setList(data)
            setShow(true)
            if(param === 0){
                setComments(data)
                setShowMore(false)
                return
            }
            setComments(data.slice(0,limit))
        })
    }

    function sendComment(e){
        e.preventDefault();
        const body = {text};
        const request = axios.post(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts/${id}/comment`, body, config)

        request.then( () => {
            setText("")
            loadingComments(0)
        })
    }

    function loadMore(){
        const newIndex = index + limit;
        const newShowMore = newIndex < (list.length -1);
        setComments([...comments,...list.slice(index, newIndex)])
        setIndex(newIndex)
        setShowMore(newShowMore)
    }

    return(
        <>
        { show ? <CommentsContainer>
            {comments.map(comment => {
               return <CommentBox key={comment.id}>
                    <ProfilePicture>
                    <Link to={`/user/${comment.user.id}`}>
                        <img src={comment.user.avatar}/>
                    </Link>
                    </ProfilePicture>
                    <div className="comment">
                        <div className="username">
                        <Link to={`/user/${comment.user.id}`}>
                            {comment.user.username}
                        </Link> 
                            <Span who={comment.who}><DotIcon/>{comment.who}</Span>
                        </div>
                        <p>
                            <ReactHashtag renderHashtag={(hashtagValue) => (
                                <Link to={`/hashtag/${hashtagValue}`.replace("#", "")}>
                                <Hashtag>{hashtagValue}</Hashtag>
                                </Link>)}>
                                    {comment.text}
                            </ReactHashtag>
                        </p>
                    </div>
            </CommentBox>})}
            { (showMore && list.length > 3) ? <SeeMore><button onClick={loadMore}>See more</button></SeeMore> : null}
            <InputBox>
                <ProfilePicture>
                    <img src={localstorage.user.avatar}/>
                </ProfilePicture>
                <form onSubmit={sendComment}>
                    <input 
                        placeholder="write a comment..." 
                        onChange={(e) => setText(e.target.value)} 
                        required
                        value={text}
                    />
                    <button type="submit">
                        <PlaneIcon />
                    </button>   
                </form>    
            </InputBox> 
        </CommentsContainer> : null}
        </>
    )
}

const CommentsContainer = styled.div`
    height: auto;
    width: 610px;
    background: #1E1E1E;
    font-size: 14px;
    padding: 30px 0;
    margin-bottom: 16px;
    margin-top: -46px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;     

    .username{
        color: #FFF;
        font-weight: 700;
    }

    p{
        color: #ACACAC;
        padding-top: 10px;
        min-width: 16px;
    }

    @media (max-width: 611px){
        border-radius:0;
        width: 100vw;
    }

`
const SeeMore = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    button {
        padding: 3px 0;
        margin-top: 5px;
        border-radius: 9px;
        width: 90px;
        background: #252525;
        color: #FFF;
        border: 1px solid #FFF;
        cursor: pointer;
    }
`

const ProfilePicture = styled.div`
    margin-right: 18px;

    img{
        height: 39px;
        width: 39px;
        border-radius: 50%;
    }
`
const InputBox = styled.div`
    display: flex;
    margin: 20px;
    margin-bottom: 0px; 
    form{
        display: flex;
        width: 100%;
        height: 39px;
        position: relative;
    }

    input{
        width: 100%;
        border-radius: 9px;
        background: #252525;
        padding: 10px;
        border: none;
        color: #FFF;
        ::placeholder{
            color: #575757;
            font-style: italic;
        }
    }

    button{
        position: absolute;
        background: #252525;
        width: 10%;
        height: 39px;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom-right-radius: 9px;
        border-top-right-radius: 9px;
        border: none
    }
`
const CommentBox = styled.div`
    display: flex;
    border-bottom: 1px solid #353535;
    margin: 0 20px;
    padding: 16px 0;

    p {
        word-break: break-all;
    }
`
const PlaneIcon = styled(IoPaperPlaneOutline)`
    color: #FFF;
    font-size: 16px;
`
const DotIcon = styled(GoPrimitiveDot)`
    padding: 4px 4px 0 4px;
`
const Span = styled.span`
    font-weight: 400;
    color: #565656;
    display: ${props => props.who ? 'inline' : 'none'}
`
const Hashtag = styled.span`
    color: #FFF;
`