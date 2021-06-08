import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { IoIosSearch } from "react-icons/io";
import styled from 'styled-components';
import {DebounceInput} from 'react-debounce-input';
import ClickAwayListener from 'react-click-away-listener';

export default function SearchBox() {

    const localstorage = JSON.parse(localStorage.user);
    const token = localstorage.token;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [followedSuggestions, setFollowedSuggestions] = useState([]);
    let history = useHistory();

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,        
                },
            };
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/follows?username=${search}`, config);
        request.then(response => {
            setFollowedSuggestions(response.data.users);
        });
        request.catch(error => {
            alert("Não foi possível obter os usuários que você segue");
        });
    },[search, token]);

    function searchUser(e) {    

        setSearch(e.target.value);
        if(search.lenght <= 2) {
            setSearch('');
            setShowSearch(0);
            return
        };

        setShowSearch(1);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,        
                },
            };
        
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/search?username=${search}`, config);
        request.then(response => {            
            const newSuggestions = response.data.users.map(name => {
                return (
                    {
                        id: name.id, 
                        username: name.username, 
                        avatar: name.avatar,
                        followed: followedSuggestions.filter(name2 => name.id === name2.id)
                    }
                );
            });            
            const orderedSuggestions = newSuggestions.sort(function(x, y) {
                let a = x.followed.length;
                let b = y.followed.length;
                return b > a ? 1 : b === a ? 0 : -1;
            });
            setSuggestions(orderedSuggestions);
        });
        
    };

    function loadUserPage(id) {
        history.push(`/user/${id}`);
        setShowSearch(0);
        window.location.reload()
      }

    return (
        <ClickAwayListener onClickAway={() => setShowSearch(0)}>
            <Form>            
                <Suggestions>
                    <li>
                        <DebounceInput 
                            type="text" name="username" placeholder="Search for people and friends" 
                            className="search-box" value={search} onChange={searchUser}
                            debounceTimeout={300}
                        />
                    <button type="submit">
                    <IoIosSearch className="search"/>  
                    </button> 
                    </li>                
                    {search.length > 2 && showSearch === 1 ? suggestions.map(name => (
                        <Li key={name.id} avatar={name.avatar} onClick={() => loadUserPage(name.id)}>
                            <span></span>
                            <h2>{name.username}</h2>
                            <h3>{name.followed.length !== 0 ? "• following" : "\u00A0"}</h3>                            
                        </Li>
                    )) : <></>}                
                </Suggestions>             
            </Form>
        </ClickAwayListener>
    );
}

const Li = styled.li`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px !important;
    :nth-child(2){
        margin-top: 16px;
    }
    span {
        width: 40px;
        height: 40px;
        border-radius: 304px;
        background: url("${props => props.avatar}");;
        background-size: cover;
        background-position: center;
        margin-right: 12px;
        margin-left: 17px;
    }
    h2 {
        font-size: 19px;
        line-height: 23px;
        color: #515151;
        margin-right: 8px;
    }
    h3 {
        font-size: 17px;
        line-height: 19px;
        color: #c5c5c5;
    }
`;

const Suggestions = styled.ul`
    width: 100%;
    border-radius: 8px;
    background: #E7E7E7;
    li {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0px;
    }
`;

const Form = styled.form`    
    width: 563px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: none;
    border-radius: 8px;
    position: relative;
    position: fixed;
    top: 15px;
    left: calc(50% - 563px / 2);
    z-index: 10;
    background: #E7E7E7;
    .search-box {
        width: 563px;
        height: 45px;
        padding: 12px 0px 10px 17px;
        border: none;
        border-radius: 8px;
        background: #FFFFFF;
        font-size: 19px;
        line-height: 23px;
        color: #666;        
    }
    input::placeholder {
        color: #C6C6C6;
    }
    input:focus, button:focus {
        border: 0px solid #333;
        box-shadow: 0 0 0 0;
        outline: 0;
    }
    button {
        height: 42px;
        border: none;
        border-radius: 8px;
        padding: 10px;
        position: absolute;
        top: 0px;
        right: 0px;
        background: #fff;
    }
    .search {
        font-size: 26px;
        color: #C6C6C6;
        cursor: pointer;
    }
    @media(max-width: 900px){
        width: 350px;
        left: calc(50% - 350px / 2);
        .search-box {
            width: 100%;
        }
    }
    @media(max-width: 611px){
        width: 100%;
        height: auto;
        padding: 11px 15px;
        top: 72px;
        left: 0;
        background: #333;
        border-radius: 0;
        .search-box {
            width: 100%;
            font-size: 17px;
            line-height: 20px;
        }
        button {
            height: 42px;
            top: 10px;
            right: 15px;
        }
    }
`;