import { Container, Row, Col } from "react-bootstrap"
import NavbarAdmin from "../components/navbarAdmin"
import { useState } from "react";
import clip from '../assets/Thumbnail.png'
import { useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { API } from '../config/api';

export default function AddProduct() {

    let navigate = useNavigate();

    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        name: '',
        stock: '',
        price: '',
        desc: '',
        image: '',
    });


    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
        });
    
        if (e.target.type === 'file') {
          let url = URL.createObjectURL(e.target.files[0]);
          setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
          e.preventDefault();
    
          const config = {
            headers: {
              'Content-type': 'multipart/form-data',
            },
          };
    
          const formData = new FormData();
          formData.set('image', form.image[0], form.image[0].name);
          formData.set('name', form.name);
          formData.set('desc', form.desc);
          formData.set('price', form.price);
          formData.set('stock', form.stock);
    
          console.log(form);
    
          const response = await API.post('/product', formData, config);
          console.log(response);
    
          navigate('/product-admin');
        } catch (error) {
          console.log(error);
        }
      });

    return(
        <div>
            <NavbarAdmin />
            <Container className="add-product">
                <Row className="add-left">
                    <Col xs="12">
                        <h3>Add Product</h3>
                    </Col>
                    <Col xs="12">
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <input
                                type="text"
                                placeholder="Product Name"
                                name="name"
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <input
                                type="number"
                                placeholder="Price (Rp.)"
                                name="price"
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <textarea
                                placeholder="Product Desc"
                                name="desc"
                                onChange={handleChange}
                                className="input-form mt-4"
                            ></textarea>
                            <input
                                type="file"
                                id="upload"
                                name="image"
                                hidden
                                onChange={handleChange}
                            />
                            <label for="upload" className="label-form mt-4">
                                Product Photo <img src={clip} alt=""/>
                            </label>
                            <div className="button">
                                <button type="submit" className="add-button">
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </Col>
                </Row>
                <div className="add-right">
                    {preview && (
                    <div>
                        <img
                            src={preview}
                            style={{
                                maxWidth: '400px',
                                maxHeight: '400px',
                                objectFit: 'cover',
                            }}
                            alt={preview}
                        />
                    </div>
                    )}
                </div>
            </Container>
        </div>
    )
}