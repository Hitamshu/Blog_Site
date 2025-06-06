import React ,{useState, useEffect} from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/configuration"
import { useNavigate, useParams } from 'react-router-dom'


function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    // console.log(slug);
    
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getBLog(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost