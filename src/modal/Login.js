import { Modal, Button, Alert } from 'react-bootstrap'
import Register from './Register';
import React, { useState, useContext } from 'react';
import { useMutation } from 'react-query';
import { API } from '../config/api';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';


export default function Login({ show, handleClose }) {
    const [regShow, setRegShow] = useState(false);
    const handleRegClose = () => setRegShow(false);
    const handleRegShow = () => setRegShow(true);

    const handleRegister = () => {
        handleRegShow();
    };

    let navigate = useNavigate();

    const [ state, dispatch] = useContext(UserContext);
    console.log(state);

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
      
            const config = {
              headers: {
                'Content-type': 'application/json',
              },
            };
      
            const body = JSON.stringify(form);
      
            const response = await API.post('/login', body, config);
            console.log(response);
      
            if (response?.status === 200) {
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: response.data.data,
              });
      
              if (response.data.data.status === 'admin') {
                navigate('/transaction-admin');
              } else {
                navigate('/');
              }
      
              const alert = (
                <Alert variant="success" className="py-1">
                  Login success
                </Alert>
              );
              setMessage(alert);
            }
        } catch (error) {
            const alert = (
            <Alert variant="danger" className="py-1">
                Login failed
            </Alert>
            );
            setMessage(alert);
            console.log(error);
        }
    });

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
            {message && message}
            <h2>Login</h2>
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                <div className="mt-3 form">
                    <input
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={handleChange}
                    className="mb-3 px-2 py-2"
                    />
                    <input
                    style={{ width: '100%' }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={handleChange}
                    className="mb-3 px-2 py-2"
                    />
                </div>
                <div className="d-grid gap-2 mt-5">
                    <Button type="submit" className="btn btn-login" style={{ width: '100%' }} variant="dark">
                    Login
                    </Button>
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
            <p>Don't have an account? klik <a style={{ fontWeight: 'bold' }} onClick={handleRegister}>here</a></p>
            </Modal.Footer>
            <Register
                show={regShow}
                handleClose={handleRegClose}
            />
        </Modal>
    )
}
