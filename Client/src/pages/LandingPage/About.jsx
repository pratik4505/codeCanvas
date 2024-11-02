import React from 'react'

function About(props) {
  return (
    <div id='about'>
        <div className="about-image">
            <img src={props.image} alt=''/>
            </div>
            <div className="about-text">
                <h2>{}</h2>
                <p>A website builder is a tool that enables you to create websites without needing to know how to code. These platforms provide pre-designed templates, drag-and-drop features, and user-friendly interfaces, making them accessible to beginners and professionals alike. Website builders are widely used by businesses, individuals, and organizations that need a website quickly and without high costs.</p>
                {/* <button>{props.button}</button> */}
            </div>
        </div>
      
    
  )
}

export default About
