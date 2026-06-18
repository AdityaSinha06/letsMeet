import './Landing.css';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="landingPageContainer">
            <nav>
                <div className="logoDiv">
                    <a href="" style={{textDecoration:"none" , color:"#fff"}}><h2>letsCHAT Video Call</h2></a>
                </div>

                <div className="menus">
                    {/* <a href="/joinasGuest">
                        Join as Guest
                    </a> */}

                    <a href="/auth">
                        Register
                    </a>

                    <a href="/auth">
                        <button style={{width:"80px",height:"25px"}} className='divBtn'>Login</button>
                    </a>
                </div>
            </nav>

            <div className="LandingMainContainer">
                <div className="divContent">
                    <h1> <span style={{color:"rgb(206, 138, 12)"}}>Connect</span> with your Loved Ones</h1>
                    <p>Cover a distance by letsCHAT video call</p>
                    <Link to="/auth"> 
                        <button className='divBtn'  style={{width:"80px",height:"25px"}} >Get Started</button>
                    </Link>
                </div>

                <div className="divPosters">
                    <img src="/mobile.png" alt="mobileImage"/>
                </div>
            </div>
        </div>
    );
}