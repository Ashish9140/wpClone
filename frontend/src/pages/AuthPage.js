import React, { useState, useContext } from 'react'
import { CartContext } from "../CartContext";
import { loginUser, signUpUser } from '../http/index'
import { useHistory } from 'react-router-dom';

const AuthPage = () => {
    const [auth, setAuth] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const { setUser } = useContext(CartContext);
    const history = useHistory();

    const handleClick = () => {
        setName('');
        setEmail('');
        setPass('');
        const log = document.querySelector('#log-bar');
        const sign = document.querySelector('#sign-bar');
        if (auth) {
            log.classList.add("active");
            sign.classList.remove("active");
            setAuth(false);
        }
        else {
            sign.classList.add("active");
            log.classList.remove("active");
            setAuth(true);
        }
    }

    

    // random colors genrater
    function random_color() {
        var rint = Math.floor(0x100000000 * Math.random());
        return 'rgb(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ')';
    }
    let color = random_color();



    async function handleSignUp(e) {
        e.preventDefault();
        if (!name || !email || !pass) {
            alert("Enter all the fields !")
            return;
        }
        const { data } = await signUpUser({ email: email, name: name, avatar: color, pass: pass });
        if (data.message) {
            alert(data.message);
            setName('');
            setEmail('');
            setPass('');

        } else {
            setUser(data.user);
            history.push('/message-area');
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !pass) {
            alert("Enter all the fields !")
            return;
        }
        const { data } = await loginUser({ email: email, pass: pass });
        if (data.message) {
            alert(data.message);
            setEmail('');
            setPass('');
        } else {
            setUser(data.user);
            history.push('/message-area');
        }
    }

    return (
        <div className="form-wrap">
            <div className="tabs">
                <h3 className="signup-tab" onClick={handleClick}><a id='sign-bar' className='active'>Sign Up</a></h3>
                <h3 className="login-tab" onClick={handleClick}><a id='log-bar' >Login</a></h3>
            </div>

            <div className="tabs-content">
                {auth ?

                    <div id="signup-tab-content" className="active">
                        <form className="signup-form" autoComplete='off'>
                            <input type="email" className="input" placeholder="Email..." value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <input type="text" className="input" placeholder="Username..." value={name} onChange={(e) => { setName(e.target.value) }} />
                            <input type="password" className="input" placeholder="Password..." value={pass} onChange={(e) => { setPass(e.target.value) }} />
                            <button className="button" onClick={handleSignUp}>
                                Sign Up
                            </button>
                        </form>
                    </div>
                    :
                    <div id="login-tab-content" className="active">
                        <form className="login-form">
                            <input type="email" className="input" placeholder="Email..." value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <input type="password" className="input" placeholder="Password..." value={pass} onChange={(e) => { setPass(e.target.value) }} />
                            <button className="button" onClick={handleLogin} >
                                Login
                            </button>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default AuthPage