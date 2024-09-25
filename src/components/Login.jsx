import React from 'react'
import {Input, Button, Logo} from './index'
import authService from '../appwrite/auth'
import {login as authLogin} from '../app/authSlice'
import {useForm} from 'react-hook-form'
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate, Link} from 'react-router-dom'

function Login() {


    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.loginUser(data)
            if (session) {
                const userData  = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
        <div className=' mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
            <div className='mb-2 flex justify-center '>
                <span className=' inline-block w-full max-w-[100px]'>
                    <Logo width="100%" />
                </span>
            </div>
            <h2 className="text-center font-bold text-2xl leading-tight">Sign in to your account</h2>
            <p className='mt-2 text-center text-base text-black/60'>
                Don&apos;t have an account?&nbsp;
                <Link
                    to='/signup'
                    className='font-medium text-primary transition-all duration-200 hover:underline '
                >
                    Sign Up
                </Link>
            </p>
            {error && (
                <p className='text-red-600 text-center mt-8'>{error}</p>
            )}
            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className='space-y-5'>
                    <Input 
                        label = "Email: "
                        type = "email"
                        placeholder = "Enter your email"
                        {...register("email",{
                            required: true,
                            validate: {
                                matchPattern: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                                 ||
                                 "Email address must be a valid address",
                            }
                        })}
                    />
                    <Input 
                        label = "Password: "
                        type = "password"
                        placeholder = "Enter your Password"
                        {...register("password", {
                            required: true
                        })}
                    />  
                    <Button
                        type="submit"
                        className='w-full'
                    >Sign In</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login