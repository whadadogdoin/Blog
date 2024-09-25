import React, { useCallback, useEffect } from 'react'
import databaseService from '../../appwrite/configs'
import {Input, Button, RTE, Select} from '../index'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'


function PostForm({post}) {

    const {register, handleSubmit, watch, setValue, getValues, control} = useForm({
        defaultValues: {
            title: post?.title || '',
            content: post?.content || '',
            slug: post?.slug || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
        if(post){
            const file = data.image[0] ? await databaseService.uploadFile(data.image[0]) : null

            if(file) await databaseService.deleteFile(post.featuredImage)
            const dbPost = await databaseService.updateDocument(post.$id,{
                ...data,
                featuredImage: file ? file.$id : undefined,
            })

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        } else {        
            const file = data.image[0] ? await databaseService.uploadFile(data.image[0]) : null
            
            if(file){
                const fileId = file.$id
                data.featuredImage = fileId

                const dbPost = await databaseService.createDocument({
                    ...data,
                    userId: userData.userData.$id
                })

                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
        }

        return ''
    })

    useEffect(() => {
      
        const subscription = watch((value,{name}) => {
            if(name === 'title')
                setValue('slug',slugTransform(value.title),{ shouldValidate: true})
        })
    
      return () => subscription.unsubscribe()
    }, [watch,slugTransform,setValue])
    


  return (
    <form className='flex flex-wrap ' onSubmit={handleSubmit(submit)}>
        <div className='w-2/3 px-2'>
            <Input 
                label = "Title"
                placeholder = "Title"
                className = "mb-4"

                {...register("title",{
                    required: true
                })}

            />

            <Input 
                label = "Slug"
                placeholder = "Slug"
                className = "mb-4"

                {...register("slug", {required:true})}
                onInput = {(e)=>{
                    setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate: true})
                }}
            />

            <RTE 
                name = "content"
                label = "Content: "
                control={control}
                defaultValue={getValues("content")}
            />

        </div>

            <div className='w-1/3 px-2'>
                <Input 
                    label = "Featured Image: "
                    type = "file"
                    className = "mb-4"
                    accept = "image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", {required: !post})}
                />
                {post && (
                    <img 
                        src = {databaseService.getFilePreview(post.featuredImage)}
                        alt = {post.title}
                        className='rounded-lg'
                    />
                )}
                <Select 
                    options = {["Active", "Inactive"]}
                    label = "Status"
                    className='mb-4'
                    {...register("status", {required:true})}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
    </form>
  )
}

export default PostForm