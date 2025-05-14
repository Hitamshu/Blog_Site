import React, {useCallback} from "react";
import { useForm } from "react-hook-form";
import {Button, Input, Select, RTE} from "../index"
import appwriteService from "../../appwrite/configuration"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "../../pages/Post";

function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, getValues, control} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    })
    // console.log("PostForm received post:", post);
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    // console.log(userData);
    // post=post.documents[0] //error occured as post.featuredImage() returned 


    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            // console.log(file);
            

            if (file) {
                 
                appwriteService.deleteFile(post.featuredImage);
            }

            
            

            const dbPost = await appwriteService.updateBlog(post.$id, {
                ...data,
                featuredImage:file ? file.$id : undefined
            })
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0])

            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createBlog({
                    ...data,
                    userId: userData.$id,
                    
                })
            
                
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }
    // console.log(post.featuredImage);
    // console.log(post);
    

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d]+/g, "-")
        }
        return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, {name}) => {
            if (name === 'title') {
                setValue('slug' , slugTransform(value.title),{shouldValidate: true})
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
            <Input 
            label="Title:"
            placeholder= "Title"
            className='mb-4'
            {...register("title", {required: true})}
            />
            <Input 
            label="Slug:"
            placeholder="Slug"
            className="mb-4"
            {...register("slug", {required: true})}
            onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                    shouldValidate: true
                })
            }}
            />
            <RTE 
            label='Content:'
            name="content"
            control={control}
            defaultValue={getValues("content")}
            />
            </div>
            <div className="w-1/3 px-2">
            <Input 
            label="Featured Image:"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", {required: !post})}
            />
            {post?.featuredImage && (
                <div className="w-full mb-4">
                    {/* {console.log("Preview URL:", appwriteService.getFileView(post.featuredImage))} */}
                    <img 
                    src={post.featuredImage ? appwriteService.getFileView(post.featuredImage) : ""} 
                    alt={post.title}
                    className="rounded-lg"
                    />
                </div>
                
            )
            
            }
            {/* {post?.featuredImage && (() => {
    const previewUrl = appwriteService.getFilePreview(post.featuredImage);
    console.log("Preview URL:", previewUrl);
    return (
        <div className="w-full mb-4">
            <img 
                src={previewUrl} 
                alt={post.title}
                className="rounded-lg"
            />
        </div>
    );
})()} */}

            {/* {console.log("Featured Image ID:", post.featuredImage)
             } */}
             {/* {console.log("Preview URL:", appwriteService.getFilePreview(post.featuredImage))} */}
            
            <Select 
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status",{required: true})}
            />
            <Button 
            type="submit"
            bgColor={post ? "bg-green-500" : undefined}
            className="w-full">
                {post ? "Update" : "Submit"}
            </Button>
            </div>
        </form>
    )
}

export default PostForm