import React, {useContext} from 'react'
import { Container, Navbar as NavbarComp, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from '../context/userContext'
import { BiLogOut, BiCommentDetail, BiUser } from "react-icons/bi";
import { API } from '../config/api';
import { useQuery } from 'react-query';
import ImgNav from '../assets/Icon.png'
import UserProfile from '../assets/blank.jpg'
import CartImg from '../assets/Vector (1).png'

export default function Navbar() {
    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/auth")
    }

    let { data: carts } = useQuery('cartsCache', async () => {
        const response = await API.get('/carts');
        return response.data.data;
    });
    console.log(carts);

    return (
        <NavbarComp expand="sm" className='navbar' >
            <Container>
                <NavbarComp.Brand as={Link} to="/">
                    <img src={ImgNav} className="img-fluid navbrand" alt='img' />
                </NavbarComp.Brand>
                <NavbarComp.Toggle aria-controls="basic-navbar-nav" />
                <NavbarComp.Collapse id="basic-navbar-nav">
                    <Link to="/cart" style={{ display: "flex" }}>
                        <img src={CartImg} className="navcart" alt='img' />
                        <span className='cart-notif'>{carts?.length}</span>
                    </Link>
                    <NavDropdown title={
                        <div className="pull-left">
                            <img src={UserProfile} alt="IMG" className='navuser'/>
                        </div>} id="basic-nav-dropdown" className="ms-auto dropdown-toggle">
                        <NavDropdown.Item>
                            <Link to="/profile" className='navdrop'>
                                <BiUser /> Profile
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <Link to="/complain" className='navdrop'>
                                <BiCommentDetail /> Complain
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logout}><BiLogOut /> Logout</NavDropdown.Item>
                    </NavDropdown>
                </NavbarComp.Collapse>
            </Container>
        </NavbarComp>
    )
}
