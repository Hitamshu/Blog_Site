import React from 'react'
import appwriteService from "../appwrite/configuration"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage}) {
  // const imageUrl = featuredImage ? appwriteService.getFileView(featuredImage) : null;
  console.log(featuredImage);
  
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
              
                <img src={appwriteService.getFileView(featuredImage)} alt={title} className='rounded-xl' />
              
                {/* {console.log(appwriteService.getFileView(featuredImage))
                } */}
            </div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard
