import UserContext from '../contexts/UserContext'
import { useContext } from 'react';
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

export default function LogIn(){
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);

    let history = useHistory();

    function SendInfo(e) {
        setDisabled(true);
        e.preventDefault();
        const info = { email, password }
        
        const request = axios.post(
            "https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/sign-in",
            info
        );
        request.then((e) => {
            setUser(e.data);
            history.push("/timeline");
            //Local Storage
            const userSerial = JSON.stringify(e.data);
            localStorage.setItem("user",userSerial);
            //
        });
        request.catch((e) => {
            if (e.response.status === 403) {
                alert("Usuário de email/senha incorretos");
                return;
            }
        });
    }

    return (
        <>
            <Container>
                <LogoContainer>
                    <div>
                        <h1>linkr</h1>
                        <p>save, share and discover <br/> the best links on the web</p>
                    </div>

                </LogoContainer>
                <InputContainer>
                    <Inputs>
                        <form onSubmit={SendInfo}>
                            <input
                                placeholder="e-mail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={disabled}
                            />
                            <input
                                placeholder="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={disabled}
                            />
                            
                            <button type="submit" disabled={disabled}>Log In</button>
                            <p><Link to="/sign-up">First time? Create an account!</Link></p>
                        </form>
                    </Inputs>
                </InputContainer>
            </Container>
            
        </>
    );
}

const Container = styled.div`
    width:100%;
    height: 100%;
    display: flex;

`
const InputContainer = styled.div`
    width:36%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const LogoContainer = styled.div`
    width: 64%;
    height: 100vh;
    background-color: #151515;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 'Passion One', cursive;

    div{
        margin-left: 16%;
    }

    h1{
        font-size: 106px;
    }

    p{
        font-size: 46px;
    }

`



const Inputs = styled.div`
    width:80%;
    margin: 0 auto;
    margin-top: 137px;

    input{
        width: 100%;
        height: 65px;
        background-color: #FFF;
        padding-left: 17px;
        border-radius : 6px;
        font-family: 'Oswald', sans-serif;
        font-size: 27px;
        font-weight: bold;
        margin-bottom: 13px;
        border: none;
    }

    button{
        width: 100%;
        height: 65px;
        background-color: #1877F2;
        color: #FFF;
        border-radius : 6px;
        font-family: 'Oswald', sans-serif;
        font-size: 27px;
        font-weight: bold;
        border: none;
        text-decoration: none;
    }

    button:hover{
        cursor: pointer;
    }

    p{
        width: 100%;
        text-align: center;
        font-family: 'Lato', sans-serif;
        font-size: 20px;
        text-decoration: underline;
        color: #FFF;
        margin-top: 14px;
    }

`