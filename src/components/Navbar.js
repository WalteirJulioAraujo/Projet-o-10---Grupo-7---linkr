import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoIosArrowDown } from "react-icons/io";
import Usercontext from '../contexts/UserContext';
import ClickAwayListener from 'react-click-away-listener';

export default function Navbar() {

    //const { user } = useContext(Usercontext);
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [showMenu, setShowMenu] = useState(0);

    function toggleMenu() {
        showMenu === 0 ? setShowMenu(1) : setShowMenu(0);
    }
    
    function ClearLocalStorage(){
        localStorage.removeItem('user');
    }

    return (
        <>
            <Header >
                <Link to='/timeline'>
                    <h1>linkr</h1>
                </Link>
                <div></div>
            </Header>
            <ClickAwayListener onClickAway={() => setShowMenu(0)}>
                <NavMenu >
                    <Menu direction={showMenu} avatar={user.user.avatar}>
                        <IoIosArrowDown className="arrow" onClick={toggleMenu}/>
                        <div onClick={toggleMenu}></div>
                    </Menu>
                    {showMenu === 1 && 
                    <Links >
                        <Link to='/my-posts'>
                            <h2>My posts</h2>
                        </Link>
                        <Link to='/my-likes'>
                            <h2>My likes</h2>
                        </Link>
                        <Link to='/' onClick={ClearLocalStorage}>
                            <h3>Logout</h3>
                        </Link>
                    </Links>
                    }
                </NavMenu>
            </ClickAwayListener>
        </>
    )
}

const Menu = styled.div`
    width: 100%;
    height: 53px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 18px;
    padding-right: 26px;

    .arrow {
        font-size: 30px;
        color: #fff;
        cursor: pointer;
        transform: ${props => props.direction ? "rotateZ(180deg)" : "none"};
        transition: 0.2s;  	
    }

    > div {
        width: 53px;
        height: 53px;
        margin-left: 12px;
        border-radius: 26.5px;
        background-image: url("${props => props.avatar}");
        background-size: cover;
        background-position: center;
    }
`;

const Links = styled.div`
    width: 132px;
    height: 109px;
    padding: 17px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 0px 0px 0px 20px;
    background: #171717;
    position: fixed;
    top: 72px;
    right: 0;
    z-index: 10;

    h1, h2, h3 {
        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: 17px;
        line-height: 20px;
        letter-spacing: 2px;
        color: #fff;
    }
`;

const NavMenu = styled.div`
    width: 132px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
`;

const Header = styled.div`
    width: 100%;
    height: 72px;
    padding: 10px 26px 10px 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #151515;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;

    h1 {
        font-family: 'Passion One', sans-serif;
        font-size: 49px;
        letter-spacing: 2px;
        line-height: 54px;
        color: #fff;
    }

    > div {
        width: 110px;
        height: 53px;
    }
`;

