import styled from "styled-components";
import { useContext, useState} from "react";
import axios from "axios";
import Usercontext from "../contexts/UserContext";
import { BiMap } from "react-icons/bi";

export default function CreatePosts({loadingPosts}) {
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [enableLocation, setEnableLocation] = useState(false);
  const {user, setUser} = useContext(Usercontext);
  const [location, setLocation] = useState("");
  const localstorage = JSON.parse(localStorage.user);
  const token = localstorage.token;
  const image = localstorage.user.avatar;
  
  function Submit(event) {
    event.preventDefault();

    if (link.length === 0) {
      alert("Percebemos que você não preencheu o link corretamente... Tente novamente ;)");
    } else {
      const body = {
        text,
	      link,
        geolocation: location
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
      };
      setIsDisabled(true);
      const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/posts", body, config);
      request.then((response) => {
        setUser(localStorage.user);
        setIsDisabled(false);
        setLink("");
        setText("");
        loadingPosts();
      });
      request.catch(() => {
        alert("Houve um erro ao publicar seu link");
        setIsDisabled(false);
      });
    }
  };

  function showLocation(position) {
    if(enableLocation === false) {
      setEnableLocation(true);
      const geolocation= {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }      
      setLocation(geolocation);
    } else {
      setEnableLocation(false);
    }
  }; 

  function errorHandler(err) {
      if(err.code === 1) {
        alert("Erro: Acesso bloqueado à sua localização!");
        setEnableLocation(false);
      } else if( err.code === 2) {
        alert("Erro: Posição geográfica não disponível");
        setEnableLocation(false);
      }
  };

  function getLocation() {
    if(navigator.geolocation) {        
        let options = {timeout:60000};
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
    } else {
        alert("Desculpe, o dispositivo não pode obter sua localização");
        setEnableLocation(false);
    }
  };

  return (
    <Post>
      <Photo image={image}></Photo>
        <Form>
          <h2>O que você tem pra favoritar hoje?</h2>
          <Styledinput
            type='link'
            disabled={isDisabled? true : false}
            onChange={(e) => setLink(e.target.value)}
            value={link}
            placeholder='http://...'
            isDisabled={isDisabled}
            required></Styledinput>
          <StyledinputText
            type='text' 
            disabled={isDisabled? true : false}
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder='O que você tem a dizer sobre isso?'
            isDisabled={isDisabled}
            required
            maxlength="185">              
            </StyledinputText>
            <Localization color={enableLocation} onClick={getLocation}>
              <BiMap className="map-icon"/>
              <p>{enableLocation ? "Localização ativada" : "Localização desativada"}</p>
            </Localization>
            <Button 
            isDisabled={isDisabled}
            onClick={
                isDisabled
                  ? ""
                  : 
                      (event) => Submit(event)
              }>
              <span> {isDisabled ? (
                  "Publicando"
                ) : (
                  "Publicar"
                )}</span>
            </Button>
        </Form>
    </Post>
  );
}

const Localization = styled.div`
  width: 502px;
  height: 31px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.color ? "#238700" : "#949494"};
  .map-icon {
    font-size: 15px;
  }
  p {
    font-size: 13px;
    margin-left: 5px;
  }
  @media(max-width: 611px){
    width: 100%;
  }
`;

const Post = styled.div`
  width: 611px;
  height: 209px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  position: relative;
  font-weight: 300;
  font-size: 23px;
  color: #707070;
  margin-bottom: 20px;
  overflow-wrap: normal;

  @media (max-width: 611px){
    width: 100vw;
    border-radius: 0;
    font-size: 17px;
    height: 164px;
    padding-bottom: 0;
  }
`;
const Photo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  background-size: cover;
  margin:5px 0px 0px 5px ;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 100px;
  }

  @media (max-width: 611px){
    display: none;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-top: 5px;
  h2 {
    margin-bottom: 12px;
  }
  @media (max-width: 611px){
    margin: 0;
    text-align: center;
    width: 100%;
  }
`;
const Styledinput = styled.input`
  width: 502px;
  height: 30px;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  line-height: 18px;
  background: #efefef;
  border-radius: 5px;
  color: #707070;
  padding-left: 10px;
  border: none;
  outline-color: transparent;
  margin-bottom: 5px;
  font-weight: 300;
  @media (max-width: 611px){
    font-size: 13px;
    width: 100%;
  }
`;
const StyledinputText = styled.input`
  width: 502px;
  height: 66px;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  line-height: 18px;
  background: #efefef;
  border-radius: 5px;
  color: #707070;
  padding-left: 10px;
  border: none;
  outline-color: transparent;
  margin-bottom: 5px;
  font-weight: 300;
  display: flex;
  justify-content: start;
  @media (max-width: 611px){
    font-size: 13px;
    height: 47px;
    width: 100%;
    margin-bottom: 3px;
  }
`;
const Button = styled.button`
  position: absolute;
  width: 112px;
  height: 31px;
  left: 480px;
  top: 161px;
  background: #1877f2;
  border-radius: 5px;
  outline-color: transparent;
  line-height: 17px;
  color: #ffffff;
  margin-bottom: 10px;
  border: none;
  font-weight: bold;
  @media (max-width: 611px){
    height: 22px;
    left: calc(100vw - 127px);
    top: 133px;
    font-size: 13px;
  }
`;
