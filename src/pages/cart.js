import Navbar from "../components/navbar"
import convertRupiah from 'rupiah-format';
import { Button, Container, Col, Row } from "react-bootstrap";
import { BiTrash } from 'react-icons/bi';
import DeleteData from '../modal/DeleteData'
import { API } from '../config/api';
import { useQuery, useMutation } from 'react-query';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Cart() {

    let navigate = useNavigate()


    const [state, setState] = useState({
        address:'',
        postcode:'',
    });

    const { address, postcode } = state

    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: carts, refetch } = useQuery('cartsCache', async () => {
        const response = await API.get('/carts');
        return response.data.data;
    });

    const handleChange = (e) => {
        console.log(`${e.target.name}: ${e.target.value}`);
        setState({
        ...state,
        [e.target.name]: e.target.value,
        });
    };

    const handlePay = useMutation(async (e) => {
        try {
            e.preventDefault();

            const priceCart = carts?.map((item) => {return item.product.price*item.qty;})
            .reduce((a, b) => a + b, 0)

            const nameCart = carts?.map((item) => {return item.product.name;})
            .join(", ")

            const qtyCart = carts?.map((item) => {return item.qty;})
            .reduce((a, b) => a + b, 0)

            const idSales = carts?.map((item) => {return item.seller.id;})
            .join(", ")
      
            const config = {
              headers: {
                'Content-type': 'application/json',
              },
            };
      
            const data = {
                idSeller: idSales,
                list: nameCart,
                qty: qtyCart,
                total: priceCart,
                address,
                postcode,
                status: "Pending"
            };
      
            const body = JSON.stringify(data);
      
            const response = await API.post('/transaction', body, config);
            carts?.map((item) => {return API.delete(`/cart/${item.id}`)})
            console.log(response);
            navigate('/profile')
        } catch (error) {
            console.log(error);
        }
    });

    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        if (confirmDelete) {
            handleClose();
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);
    return(
        <div>
            <Navbar />
            <Container style={{ padding: '15px' }}>
                <h4 style={{ padding: '10px', color: "#613D2B" }}>My Cart</h4>
                <p>Review Your Order</p>
                <Row>
                    <Col md="6">
                        <div style={{ borderBottom: '2px solid', borderTop: '2px solid' }}>
                            {carts?.map((item, index) => (
                            <div key={index} className="p-2 mb-1">
                                <Container fluid className="px-1">
                                    <Row>
                                        <Col>
                                            <img
                                                src={item.product.image}
                                                alt=""
                                                className="img-fluid"
                                                style={{
                                                    height: '120px',
                                                    width: '100px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Col>
                                        <Col xs="6">
                                            <div className="text-title">{item.product.name}</div>
                                            <div className="mt-3 text-content">Qty : {item.qty}</div>
                                        </Col>
                                        <Col>
                                            <div className="mt-1 text-content">
                                                {convertRupiah.convert(item.product.price)}
                                            </div>
                                            <Button 
                                                variant='transparent'
                                                onClick={() => {handleDelete(item.id);}}
                                            >
                                                <BiTrash style={{ width: '25px', height: '25px' }}/> 
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            ))}
                        </div>
                    </Col>
                    <Col md="6" style={{ borderTop: "2px solid" }}>
                        {carts?.map((item, index) => (
                        <Row key={index} className="p-2 mb-1">
                            <Col xs="8">
                                {item.product.name}
                            </Col>
                            <Col xs="4">
                                {convertRupiah.convert(item.product.price*item.qty)}
                            </Col>
                        </Row>
                        ))}
                        <Row className="p-2 mb-1" style={{ borderTop: "2px solid" }}>
                            <Col xs="8">
                                Total:
                            </Col>
                            <Col xs="4">
                                {convertRupiah.convert(
                                    carts?.map((item) => {
                                        return item.product.price*item.qty;
                                    })
                                    .reduce((a, b) => a + b, 0)
                                )}
                            </Col>
                        </Row>
                        <textarea
                            type="text"
                            placeholder="Input Your Address"
                            name="address"
                            onChange={handleChange}
                            className="input-transaction mt-4 mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Input Your Postcode"
                            name="postcode"
                            onChange={handleChange}
                            min="1"
                            className="input-transaction mt-4 mb-4"
                        />
                        <div className="button">
                            <button 
                                type="submit" 
                                className="add-button"
                                onClick={(e) => handlePay.mutate(e)}
                            >
                                Pay
                            </button>
                        </div>
                    </Col>
                </Row>
                <DeleteData
                    setConfirmDelete={setConfirmDelete}
                    show={show}
                    handleClose={handleClose}
                />
            </Container>
        </div>
    )
}