import React from 'react'
import Navbar from './Navbar'
function Header (){
  return (
    <div id='main'>
      <Navbar/>
      <div className='name'>
        <h1><span>Buid your site </span>with Ease and Effeciency</h1>
        <p>Get your website build within a minutes.Easy to use and handle.Friendly for new users!</p>
        <a href='#' className='cv-btn'>Register</a>
      </div>
    </div>
  )
}

export default Header
