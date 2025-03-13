import React, { useEffect, useState } from 'react'
import { Container,PostForm } from '../Components'
import DbService from '../appwrite/configuration'
import { useNavigate, useParams } from 'react-router'
const Editpost = () => {
    const[post,setPost] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(slug){
            DbService.getPost(slug).then((post) => {
                if(post) {
                    setPost(post)
                }
            })
        }else{
            navigate('./')
        }
    },[slug,navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
    ) : null
  
}

export default Editpost