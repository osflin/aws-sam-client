import React from 'react';
import { Link } from 'react-router-dom'

const Header = (props) => {
  return (
        <nav className="bg-black flex justify-between bb">
            <a className="white link dim no-underline flex items-center pa3" href="">
              KiateK
            </a>
            <div className="flex-grow pa3 flex items-center">
            <Link className="f6 link dib white dim mr3 mr4-ns" to={`/`}>Home</Link>
              <a className="f6 link dib white dim mr3 mr4-ns" href="#0">About</a>              
              <Link className="f6 link dib white dim mr3 mr4-ns" to={`/login/`}>Sign In</Link>
              <a className="f6 dib white bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20" href="#0">Sign Up</a>
            </div>
      </nav>
  );
}

export default Header;
