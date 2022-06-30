import NavbarAdmin from "../components/navbarAdmin"
import { Container, Table } from "react-bootstrap"
import { useQuery } from 'react-query';
import { API } from '../config/api';
import { useEffect, useState } from "react";
import { ImCross, ImCheckmark } from "react-icons/im";

export default function TransactionAdmin() {

    let { data: transadmin } = useQuery('transactionsCache', async () => {
        const response = await API.get('/transadmin');
        console.log(response);
        return response.data.data;
    });
    const [action, setAction] = useState("")
    const checkAct = () => {
        transadmin?.map((item) => {
            if (item.status === "Success") {
                setAction(<ImCheckmark />);
            }   else {
                  setAction(<ImCross />);
                }
        })
    };

    useEffect(() => {
        checkAct();
    }, []);
    return(
        <div>
            <NavbarAdmin />
            <h4 className="add-product">Income Transaction</h4>
            <Container className="add-product">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Post Code</th>
                        <th>Products Order</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    {transadmin?.map((item, index) => (
                    <tbody key={index}>
                        <tr>
                        <td>{index + 1}</td>
                        <td>{item.buyer.name}</td>
                        <td>{item.address}</td>
                        <td>{item.postcode}</td>
                        <td>{item.list}</td>
                        <td>{item.status}</td>
                        <td>{action}</td>
                        </tr>
                    </tbody>
                    ))}
                </Table>
            </Container>
        </div>
    )
}