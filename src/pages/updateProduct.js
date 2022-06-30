import NavbarAdmin from "../components/navbarAdmin"
import { Container, Row, Col } from "react-bootstrap"
import { useState } from "react";
import { useNavigate, useParams } from 'react-router';
import clip from '../assets/Thumbnail.png'
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';

export default function UpdateProduct() {

    let navigate = useNavigate();
    const { id } = useParams();

    const [preview, setPreview] = useState(null);
    const [product, setProduct] = useState({});
    const [form, setForm] = useState({
        name: '',
        stock: '',
        price: '',
        desc: '',
        image: '',
    });

    useQuery('productCache', async () => {
        const response = await API.get('/product/' + id);
        setPreview(response.data.data.image);
        setForm({
          ...form,
          name: response.data.data.name,
          desc: response.data.data.desc,
          price: response.data.data.price,
          stock: response.data.data.stock,
        });
        setProduct(response.data.data);
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
          if (form.image) {
            formData.set('image', form?.image[0], form?.image[0]?.name);
          }
          formData.set('name', form.name);
          formData.set('desc', form.desc);
          formData.set('price', form.price);
          formData.set('qty', form.stock);
    
          const response = await API.patch(
            '/product/' + product.id,
            formData,
            config
          );
          console.log(response.data);
    
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
                        <h3>Update Product</h3>
                    </Col>
                    <Col xs="12">
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <input
                                type="text"
                                placeholder="Product Name"
                                name="name"
                                value={form?.name}
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                value={form?.stock}
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <input
                                type="number"
                                placeholder="Price (Rp.)"
                                name="price"
                                value={form?.price}
                                onChange={handleChange}
                                className="input-form mt-4"
                            />
                            <textarea
                                placeholder="Product Desc"
                                name="desc"
                                value={form?.desc}
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
                                Photo Product <img src={clip} alt=""/>
                            </label>
                            <div className="button">
                                <button type="submit" className="add-button">
                                    Update Product
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