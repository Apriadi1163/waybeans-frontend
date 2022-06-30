import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import dateFormat from 'dateformat';
import convertRupiah from 'rupiah-format';
import Navbar from '../components/navbar';
import imgBlank from '../assets/blank.jpg';
import { useQuery } from 'react-query';
import { UserContext } from '../context/userContext';
import ImgNav from '../assets/Icon.png'
import { API } from '../config/api';
import QRcode from 'qrcode.react'

export default function Profile() {
  const [state] = useContext(UserContext);

  let { data: transactions } = useQuery('transactionsCache', async () => {
    const response = await API.get('/transactions');
    return response.data.data;
  });

  return (
    <div>
      <Navbar />
      <Container className="my-5">
        <Row>
          <Col md="6">
            <div 
              className="mb-4"
              style={{ 
                fontFamily: 'Avenir',
                fontStyle: 'normal',
                fontWeight: '900',
                fontSize: '24px',
                lineHeight: '33px',
                color: '#974A4A',
              }}
            >
              My Profile
            </div>
            <Row>
              <Col md="6">
                <img
                  src={imgBlank}
                  className="img-fluid rounded"
                  alt="avatar"
                />
              </Col>
              <Col md="6">
                <div className="text-title">Full Name</div>
                <div className="text-content">{state?.user.name || "-"}</div>

                <div className="text-title">Email</div>
                <div className="text-content">{state?.user.email || "-"}</div>
              </Col>
            </Row>
          </Col>
          <Col md="6">
            <div className="mb-4">My Transaction</div>
              <div>
                {transactions?.map((item, index) => (
                  <div key={index} className="p-2 mb-1" style={{ backgroundColor: "#F6E6DA" }}>
                    <Container fluid className="px-1">
                      <Row>
                        <Col xs="3">
                          <QRcode value={item.list} />
                        </Col>
                        <Col xs="6">
                          <div className="text-title">{item.list}</div>
                          <div className="text-content">
                            {dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}
                          </div>
                          <div className="mt-3 text-content">
                            {convertRupiah.convert(item.total)}
                          </div>
                          <div className="text-content">{item.qty} Items</div>
                        </Col>
                        <Col xs="3">
                          <img src={ImgNav} alt="" className='navbrand'/>
                          <div className="mt-4 text-content">Success</div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                ))}
              </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}