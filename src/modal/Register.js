import { Modal, Button, Form } from 'react-bootstrap'
import Login from './Login';
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { API } from '../config/api';

export default function Register({ show, handleClose }) {
    const [logShow, setLogShow] = useState(false);
    const handleLogClose = () => setLogShow(false);
    const handleLogShow = () => setLogShow(true);

    const handleLogin = () => {
        handleLogShow();
    };

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = form;

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

            const response = await API.post('/register', body, config);

            if (response.data.status === 'success...') {
            const alert = (
                <Alert variant="success" className="py-1">
                Success
                </Alert>
            );
            setMessage(alert);
            setForm({
                name: '',
                email: '',
                password: '',
            });
            } else {
            const alert = (
                <Alert variant="danger" className="py-1">
                Failed
                </Alert>
            );
            setMessage(alert);
            }
        } catch (error) {
            const alert = (
            <Alert variant="danger" className="py-1">
                Failed
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
            <h2>Register</h2>
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
                    <input
                    style={{ width: '100%' }}
                    type="name"
                    placeholder="Fullname"
                    value={name}
                    name="name"
                    onChange={handleChange}
                    className="mb-3 px-2 py-2"
                    />
                </div>
                <div className="d-grid gap-2 mt-5">
                    <Button type="submit" className="btn btn-login" style={{ width: '100%' }} variant="dark">
                    Register
                    </Button>
                </div>
            </form>
            </Modal.Body>
            <Modal.Footer>
                <p>Already have an account? klik
                    <a style={{ fontWeight: 'bold' }} onClick={handleLogin}>here</a>
                </p>
            </Modal.Footer>
            <Login
                show={logShow}
                handleClose={handleLogClose}
            />
        </Modal>
    )
}
