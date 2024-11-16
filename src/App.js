import React from 'react';
import { Navbar, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import bellPepper from './assets/bell-pepper.png';
import { useState } from 'react';
import Card from "./Card";

function App() {

  // Functions

  // State
  const [show, setShow] = useState(false); // State for create order modal
  const [showOrders, setShowOrders] = useState(false); // State for "View Orders" modal
  const [tableNumber, setTableNumber] = useState(""); // State for the table number
  const [partySize, setPartySize] = useState(1); // State for the party size
  const [orders, setOrders] = useState([]); // State for the dropdown orders
  const [data, setData] = useState([]); // State to store data by table number

  // Functions to show or hide modals
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseOrders = () => setShowOrders(false);
  const handleShowOrders = () => setShowOrders(true);

  // Update dropdown options based on party size
  const handlePartySizeChange = (e) => {
    const size = parseInt(e.target.value, 10) || 1;
    setPartySize(size);
    setOrders(Array(size).fill("")); // Initialize empty orders for each person
  };

  // Handle dropdown selection
  const handleOrderChange = (index, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = value;
    setOrders(updatedOrders);
  };


  // Save data
  const handleSave = () => {
    setData((prev) => [
      ...prev,
      {
        tableNumber,
        partySize,
        orders,
        timestamp: new Date().getTime(), // timestamp for sorting
      },
    ]);

    handleClose(); // Close the modal
    setTableNumber(""); // Reset the modal fields
    setPartySize(1);
    setOrders([]);
    console.log(data);
  };







  // Structure of application (React/html)
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <img
              src={bellPepper}
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top"
              style={{
                marginRight: '5px',
                filter: 'invert(100%)',
              }}
            />
            DineFlow
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="justify-content-center mb-4">
          <Col xs={12} sm={4} className="d-flex justify-content-center mb-3">
            <Button variant="outline-dark" className="w-100" onClick={handleShow}>
              New Order
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>New Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {/* Table Number */}
                  <Form.Group className="mb-3">
                    <Form.Label>Table Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </Form.Group>

                  {/* Party Size */}
                  <Form.Group className="mb-3">
                    <Form.Label>Number of People</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="8"
                      value={partySize}
                      onChange={handlePartySizeChange}
                    />
                  </Form.Group>

                  {/* Dropdown Menus for Each Person */}
                  {Array.from({ length: partySize }).map((_, index) => (
                    <Form.Group className="mb-3" key={index}>
                      <Form.Label>Order for Person {index + 1}</Form.Label>
                      <Form.Select
                        value={orders[index]}
                        onChange={(e) => handleOrderChange(index, e.target.value)}
                      >
                        <option value="">Select an option</option>
                        <option value="Dinner Option #1">Dinner Option #1</option>
                        <option value="Dinner Option #2">Dinner Option #2</option>
                        <option value="Dinner Option #3">Dinner Option #3</option>
                      </Form.Select>
                    </Form.Group>
                  ))}
              </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>



          <Col xs={12} sm={4} className="d-flex justify-content-center mb-3">
            <Button variant="outline-dark" className="w-100" onClick={handleShowOrders}>
              View Orders
            </Button>

            <Modal show={showOrders} onHide={handleCloseOrders}>
              <Modal.Header closeButton>
                <Modal.Title>View Orders</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {data.length === 0 ? (
                  <p>No orders available.</p>
                ) : (
                  data
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((order, index) => (
                      <Card
                        key={index}
                        tableNumber={order.tableNumber}
                        partySize={order.partySize}
                        orders={order.orders}
                      />
                    ))
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseOrders}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>




          <Col xs={12} sm={4} className="d-flex justify-content-center mb-3">
            <Button variant="outline-dark" className="w-100">
              Tables
            </Button>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex justify-content-end">
            <Button variant="dark" size="sm">
              Admin Dashboard
            </Button>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default App;
