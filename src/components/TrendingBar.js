import axios from "axios";
import { useContext, useEffect, useState,  } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Usercontext from "../contexts/UserContext";
import ReactHashtag from "react-hashtag";
import { FaHashtag } from "react-icons/fa";

export default function TrendingBar() {
  const { user, setUser } = useContext(Usercontext);
  const [hashtags, setHashtags] = useState([]);
  const localstorage = JSON.parse(localStorage.user);
  const token = localstorage.token;
  const [searchHashtags, setSearchHashtags] = useState("");
  let history = useHistory();

  

  useEffect(() => trendingTopics(), [searchHashtags]);

  function trendingTopics() {
    const params ={};

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const request = axios.get(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/trending",
      config
    );

    request.then((response) => {
      setHashtags(response.data.hashtags);
      setUser(localStorage.user);
    });
  }

 function RedirectToHashtag(event){
  event.preventDefault();
  const newHashtags = hashtags.map((hashtag) => (hashtag.name))
  if(newHashtags.includes(searchHashtags)) {
    history.push(`/hashtag/${searchHashtags}`)
  }
 }
 
  return (
    <>
      <h1>trending</h1>
      <ul>
        {hashtags.lenght === 0 ? "" : hashtags.map((hashtag) => (
          <Link to={`/hashtag/${hashtag.name}`}>
            <li>#{hashtag.name}</li>
          </Link>
        ))}
      </ul>
      <div>
        <form onSubmit = {hashtags.lenght !== 0 ? RedirectToHashtag : ""}>
        <Input 
          type='text'
          value={searchHashtags}
          placeholder='type a hashtag'
          onChange={(e) => setSearchHashtags(e.target.value)}
         /></form>
        <FaHashtagAlt className='hashtag-icon' />
      </div>
    </>
  );
}

const Hashtag = styled.span`
  color: #fff;
  font-size: 19px !important;
  line-height: 23px;
`;

const FaHashtagAlt = styled(FaHashtag)`
  color: #FFF;
  font-size: 19px;
  line-height: 23px;
  cursor: pointer;
  margin-left: 10px;
  position: absolute;
  top: 8px;
  left: 17px;
`;
const Input = styled.input`
  ::placeholder{
    color: #FFF;
  }
  :focus{
    outline: 0;
    border: 0 none;
  }
    color: #FFF; 
`
