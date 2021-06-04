import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Usercontext from "../contexts/UserContext";
import { Container, Posts, Trending, Load, PageTitle } from "../styledComponents/Content";
import useInterval from 'react-useinterval';
import Navbar from "./Navbar";
import Post from "./Post";
import TrendingBar from "./TrendingBar";
import { ContainerModal,Modal } from '../styledComponents/Content';

export default function MyPosts() {
  const { user, setUser } = useContext(Usercontext);
  const [posts, setPosts] = useState([]);
  const [requestLoading, setRequestLoading] = useState(1);
  const [erro, setErro] = useState(0);
  const localstorage = JSON.parse(localStorage.user);
  const location = useLocation();

  const [modal, setModal] = useState(false);
  const [link, setLink ] = useState("");

  useEffect(loadMyPosts, []);

  function loadMyPosts() {
    const token = localstorage.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const request = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${localstorage.user["id"]}/posts`,
      config
    );

    request.then((e) => {
      setUser(localStorage.user);
      setPosts(e.data.posts);
      setRequestLoading(0);
    });
    request.catch(() => {
      setErro(1);
    });
  }

  function OpenModal(e){
    setLink(e);
    setModal(true);
  }

  function CloseModal(){
      setModal(false);
  }

  function OpenInNewTab(){
      window.open(link)
  }

  useInterval(loadMyPosts, 15000);

  return (
    <>
      <Navbar />
      <Container>
        <PageTitle>
          <h1>my posts</h1>
        </PageTitle>
        <div>
          <Posts>
            {requestLoading ? (
              erro ? (
                <Load>
                  Houve uma falha ao obter os posts,
                  <br />
                  por favor atualize a página.
                </Load>
              ) : (
                <Load>Loading</Load>
              )
            ) : posts.length ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  post={post}
                  postUser={post.user}
                  likes={post.likes}
                  loadMyPosts={loadMyPosts()}
                  location={location}
                  OpenModal={OpenModal}
                />
              ))
            ) : (
              <Load>Nenhum post encontrado</Load>
            )}
          </Posts>
          <Trending>
            <TrendingBar />
          </Trending>
        </div>
      </Container>
      {modal
      ?<ContainerModal>
          <div>
              <button className="OpenInNewTab" onClick={OpenInNewTab}>Open in new tab</button>
              <button className="CloseModal"onClick={CloseModal}>X</button>
          </div>
          <Modal>
              <iframe src={link}></iframe>
          </Modal>
      </ContainerModal>
      :""
      }
    </>
  );
}
