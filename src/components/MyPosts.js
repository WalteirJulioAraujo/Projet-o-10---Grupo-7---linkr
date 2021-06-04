import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Usercontext from "../contexts/UserContext";
import { Container, Posts, Trending, Load, PageTitle } from "../styledComponents/Content";
import useInterval from 'react-useinterval';
import Navbar from "./Navbar";
import Post from "./Post";
import TrendingBar from "./TrendingBar";
import loading from '../img/loading.svg'
import { ContainerModal,Modal } from '../styledComponents/Content';

export default function MyPosts() {
  const { user, setUser } = useContext(Usercontext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(1);
  const [isError, setIsError] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const loadingMore = <Load><div><img src={loading}/> Loading more posts...</div></Load>
  const localstorage = JSON.parse(localStorage.user);
  const location = useLocation();
  const token = localstorage.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [modal, setModal] = useState(false);
  const [link, setLink ] = useState("");

  useEffect(loadMyPosts, []);

  function loadMyPosts() {
    const request = axios.get(
      `https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${localstorage.user["id"]}/posts`,
      config
    );

    request.then((e) => {
      setUser(localStorage.user);
      setPosts(e.data.posts);
      setIsLoading(0);
    });
    request.catch(() => {
      setIsError(1);
      setIsLoading(1);
    });
  }

function updateMyPosts(){
  setIsError(0)
  const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${localstorage.user["id"]}/posts?offset=10`,config)
  
  request.then( response => {
      if(response.data.posts != undefined){
          setPosts([...response.data.posts, ...posts]);
      } 
  })
  
  request.catch( () => {setIsError(1); setIsLoading(0); setHasMorePosts(false)})
}

function fetchMyPosts(){
  setIsError(0)
  if(posts.length > 200){
      setHasMorePosts(false)
      return
  }
  if(posts.length !== 0){
    const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${localstorage.user["id"]}/posts?olderThan=${posts[posts.length - 1].id}`, config)

    request.then( response => {
      if(response.data.posts.length < 10){
          setHasMorePosts(false)
      } 
      setTimeout(() => setPosts([...posts,...response.data.posts]),1000)
    })

    request.catch( () => {setIsError(1); setIsLoading(0); setHasMorePosts(false)})
}
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

useInterval(updateMyPosts, 15000);

  return (
    <>
      <Navbar />
      <Container>
        <PageTitle>
          <h1>my posts</h1>
        </PageTitle>
        <div>
          <Posts>
            {isLoading ? (
              isError ? (
                <Load>
                  Houve uma falha ao obter os posts,
                  <br />
                  por favor atualize a página.
                </Load>
              ) : (
                <Load><div><img src={loading} alt="Loading"/>Loading...</div></Load>
              )
            ) : posts.length ?  (
            <InfiniteScroll pageStart={0} loader={loadingMore} hasMore={hasMorePosts} loadMore={fetchMyPosts}>
              {posts.map((post) => (
                  <Post
                    key={post.id}
                    id={post.id}
                    post={post}
                    postUser={post.user}
                    likes={post.likes}
                    loadMyPosts={updateMyPosts}
                    location={location}
                    OpenModal={OpenModal}
                  />
                ))}
            </InfiniteScroll>) : (
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
