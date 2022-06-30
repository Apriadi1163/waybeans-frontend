import NavbarAuth from '../components/navbarAuth'
import HomeImg from '../assets/Jumbotron.png'
import Masonry from 'react-masonry-css';
import convertRupiah from "rupiah-format";
import { Container } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { API } from '../config/api';

export default function HomeAuth() {
    const breakpointColumnsObj = {
        default: 4,
        1100: 4,
        700: 3,
        500: 2,
    };

    let { data: products } = useQuery('productsCache', async () => {
        const response = await API.get('/products');
        return response.data.data;
    });

    return(
        <div>
            <NavbarAuth />
            <Container className='bodyhome'>
                <img src={HomeImg} alt="img"/>
                <div>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {products?.map((item, index) => (
                        <div style={{ textDecoration: "none" }} item={item} key={index} >
                            <div className="card-product mt-3">
                                <img 
                                    src={item.image} 
                                    className="img-fluid img-rounded" 
                                    alt={item.name} 
                                />
                                <div className="p-2">
                                    <div className="text-header-product-item">{item.name}</div>
                                    {/* <div className="text-product-item">{convertRupiah.convert(item.price)}</div>
                                    <div className="text-product-item">Stock : {item.stock}</div> */}
                                </div>
                            </div>
                        </div>
                        ))}
                    </Masonry>
                </div>
            </Container>
        </div>
    )
}