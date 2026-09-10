import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'


const Register = () => {
  const {loading,handleRegister}=useAuth()

  const navigate=useNavigate()

  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  React.useEffect(() => {
    document.title = "PrepForge AI | Register";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username,email,password})
    navigate('/dashboard')
  }

  if(loading){
    return (<main><h1>Loading...........</h1></main>)
  }


  return (
    <main>
      <div className="form-container" >
        <h1>Join PrepForge AI</h1>


        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' name='username' placeholder='Enter username'
            onChange={(e)=>{setUsername(e.target.value)}}
            />

          </div>
          <div className="input-group">
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' placeholder='Enter email address'
            onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>

          <div className="input-group">
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' placeholder='Enter Password'
            onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>

          <button className='button primary-button'>Sign Up</button>

        </form>

        <p>Already have an acccount? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register