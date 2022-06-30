import NavbarAdmin from "../components/navbarAdmin"
import React, { useEffect, useState, useContext } from "react"
import { io } from "socket.io-client"
import Contact from "../components/contact"
import { Col, Container, Row } from "react-bootstrap"
import Chat from "../components/chat"
import { UserContext } from "../context/userContext"

let socket

export default function ComplainAdmin() {
    const [contact, setContact] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);

    const [state] = useContext(UserContext);

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socket.on('new message', () => {
            socket.emit('load messages', contact?.id);
        });

        loadContacts();
        loadMessages();
 
        return () => {
            socket.disconnect()
        }
    }, [messages])

    const loadContacts = () => {
        socket.emit('load customer contacts')
        socket.on('customer contacts', (data) => {
            const dataContacts = data?.map((item) => ({
                ...item,
                message: 
                    item.senderMessage.length > 0
                        ? item.senderMessage[item.senderMessage.length - 1].message
                        : 'Click here to start message',
            }));
            setContacts(dataContacts);
        })
    }

    const onClickContact = (data) => {
        setContact(data);
        socket.emit('load messages', data.id);
    };

    const loadMessages = () => {
        socket.on('messages', (data) => {
          console.log(data);
          if (data.length > 0) {
            const dataMessages = data.map((item) => ({
              idSender: item.sender.id,
              message: item.message,
            }));
            setMessages(dataMessages);
          } else {
            setMessages([]);
          }
        });
    };

    const onSendMessage = (e) => {
        if (e.key === 'Enter') {
          const data = {
            idRecipient: contact.id,
            message: e.target.value,
          };
    
          socket.emit('send message', data);
          e.target.value = '';
        }
    };
    return(
        <div>
            <NavbarAdmin />
            <Container fluid style={{ height: "89" }}>
                <Row>
                    <Col md={3} style={{ height: "89", borderRight: "2px solid black" }}>
                        <Contact 
                            clickContact={onClickContact}
                            dataContact={contacts}
                            contact={contact}
                        />
                    </Col>
                    <Col md={9} style={{ height: "89", borderRight: "2px solid black" }}>
                        <Chat
                            contact={contact}
                            messages={messages}
                            user={state.user}
                            sendMessage={onSendMessage}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}