import React, { useState, useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import convertRupiah from 'rupiah-format';
import NavbarAdmin from '../components/navbarAdmin';
import DeleteData from '../modal/DeleteData';
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';

export default function ProductAdmin() {
  let navigate = useNavigate();

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { data: products, refetch } = useQuery('productsCache', async () => {
    const response = await API.get('/prodmin');
    return response.data.data;
  });

  const addProduct = () => {
    navigate('/add-product');
  };

  const handleUpdate = (id) => {
    navigate('/update-product/' + id);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/product/${id}`);
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

  return (
    <div>
      <NavbarAdmin />
      <h4 className="add-product">List Product</h4>
      <Container>
        <button
          onClick={addProduct}
          className="add-button"
        >
          Add Product
        </button>
      </Container>
      <Container className="py-5 add-product">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className="align-middle">No</th>
                    <th className="align-middle">Photo</th>
                    <th className="align-middle">Product Name</th>
                    <th className="align-middle">Product Desc</th>
                    <th className="align-middle">Price</th>
                    <th className="align-middle">Stock</th>
                    <th className="align-middle">Action</th>
                </tr>
            </thead>
            <tbody>
                {products?.map((item, index) => (
                <tr key={index}>
                  <th className="align-middle" scope="row">{item.id}</th>
                  <td className="align-middle">
                    <img src={item.image} style={{ height: "50px", widht: "50px" }}/>
                  </td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.desc}</td>
                  <td className="align-middle">{convertRupiah.convert(item.price)}</td>
                  <td className="align-middle">{item.stock}</td>
                  <td className="align-middle">
                      <Button
                        onClick={() => {
                          handleUpdate(item.id);
                        }}
                        className="btn-sm btn-success me-2"
                        style={{ width: '135px' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {handleDelete(item.id);}}
                        className="btn-sm btn-danger"
                        style={{ width: '135px' }}
                      >
                        Delete
                      </Button>
                  </td>
                </tr>
                ))}
            </tbody>
        </Table>
      </Container>
      <DeleteData
         setConfirmDelete={setConfirmDelete}
         show={show}
         handleClose={handleClose} 
      />
    </div>
  );
}