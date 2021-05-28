import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Usercontext from '../contexts/UserContext'

export default function TrendingBar() {
    //const { user } = useContext(Usercontext)
    const user = JSON.parse(localStorage.getItem('user'));
    const [hashtags, setHashtags] = useState([])

    useEffect(() => trendingTopics(),[])

    function trendingTopics() {
        const config = {headers: {Authorization: `Bearer ${user.token}`}}
        const request = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/linkr/hashtags/trending", config)

        request.then( response => {setHashtags(response.data.hashtags)})
    }

    return (
        <>
        <h1>trending</h1>
        <ul> 
            { hashtags.map(hashtag => <Link to={`/hashtag/${hashtag.name}`}><li>#{hashtag.name}</li></Link>)}
        </ul>
        </>
    )
}