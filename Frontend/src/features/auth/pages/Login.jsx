import React, { useState } from 'react'
import '../auth.form.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const {loading,handleLogin}=useAuth()
  const navigate=useNavigate()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  React.useEffect(() => {
    document.title = "PrepForge AI | Login";
  }, []);

  const handleSubmit = async (e) => {
          e.preventDefault();
          await handleLogin({email,password});
          navigate('/dashboard');
  }

  if(loading){
    return (<main><h1>Loading.....</h1></main>)
  }

  return (
      <main>
        <div className="form-container" >
        <h1>Login to PrepForge AI</h1>


        <form onSubmit={handleSubmit} >
        <div className="input-group">
          <label htmlFor='email'>Email</label>
          <input
          type='email' id='email' name='email' placeholder='Enter email address'
          onChange={(e)=>{setEmail(e.target.value) }}
          />
        </div>
        <div className="input-group">
          <label htmlFor='password'>Password</label>
          <input
           type='password' id='password' name='password' placeholder='Enter Password'
           onChange={(e)=>{setPassword(e.target.value) }}
           />
        </div>

        <button className='button primary-button'>Login</button>

        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </main>
  )
}

export default Login