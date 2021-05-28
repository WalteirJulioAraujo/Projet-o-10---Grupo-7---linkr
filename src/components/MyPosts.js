
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Usercontext from "../contexts/UserContext";
import { Container, Posts, Trending } from "../styledComponents/Content";
import Navbar from "./Navbar";
import Post from "./Post";
import TrendingBar from "./TrendingBar";

export default function MyPosts(){

    //const { user } = useContext(Usercontext);
    const user = JSON.parse(localStorage.getItem('user'));
    const [ posts, setPosts ] = useState([]);
    const [ requestLoading, setRequestLoading ] = useState(1);
    const [ erro, setErro ] = useState(0);

    const config = { headers:{ Authorization: `Bearer ${user.token}`}};
    useEffect(()=>{
        const request = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/users/${user.user.id}/posts`,config);

        request.then((e)=>{
            setPosts(e.data.posts)
            setRequestLoading(0);     
        })
        request.catch(()=>{
            setErro(1);
        })
    
    },[])


    return(
        <>
            <Navbar />
            <Container>
                <h1>My posts</h1>
                <div>
                    <Posts>
                    {requestLoading
                    ?(erro?<p>Houve uma falha ao obter os posts,<br/>por favor atualize a página.</p>:"Loading...")
                    :(posts.length ? (posts.map( (post) => 
                        <Post 
                            key={post.id} id={post.id} post={post} 
                            postUser={post.user} likes={post.likes}
                        />)) : 
                        "Nenhum post encontrado")
                    }
                    </Posts>                    
                    <Trending >
                        <TrendingBar />
                    </Trending>
                    
                </div>  
            </Container>
        </>
    )
}
