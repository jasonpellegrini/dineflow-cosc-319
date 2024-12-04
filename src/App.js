import React from 'react';
import { Navbar, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import bellPepper from './assets/bell-pepper.png';
import { useState } from 'react';
import Card from "./Card";

function App() {

  // Functions

  // State
  const [show, setShow] = useState(false); // Create order modal
  const [showOrders, setShowOrders] = useState(false); // View orders modal
  const [showTables, setShowTables] = useState(false); // Tables modal
  const [tableNumber, setTableNumber] = useState(""); // Table number
  const [partySize, setPartySize] = useState(1); // Party size
  const [orders, setOrders] = useState([]); // Orders dropdown
  const [data, setData] = useState([]); // Orders data

  // State for tracking table statuses
  const [tableStates, setTableStates] = useState(
    Array(20).fill({ status: "default" }) // Default status for all tables
  );

  // Function to handle table status changes
  const handleTableAction = (index, newStatus) => {
    setTableStates((prevStates) =>
      prevStates.map((table, i) =>
        i === index ? { ...table, status: newStatus } : table
      )
    );
  };

  // Functions to show or hide modals
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseOrders = () => setShowOrders(false);
  const handleShowOrders = () => setShowOrders(true);
  const handleCloseTables = () => setShowTables(false);
  const handleShowTables = () => setShowTables(true);

  // Update dropdown options based on party size
  const handlePartySizeChange = (e) => {
    const size = parseInt(e.target.value, 10) || 1;
    setPartySize(size);
    setOrders(Array(size).fill("")); 
  };

  // Handle dropdown selection
  const handleOrderChange = (index, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = value;
    setOrders(updatedOrders);
  };


  // Save data
  const handleSave = () => {
    const validOrders = Array.isArray(orders) ? orders : Array(partySize).fill("");
  
    setData((prev) => [
      ...prev,
      {
        tableNumber,
        partySize,
        orders: validOrders,
        stage: 0,
        timestamp: new Date().getTime(),
      },
    ]);
  
    // Update table status to "ordered"
    const tableIndex = parseInt(tableNumber, 10) - 1; // Convert table number to index
    handleTableAction(tableIndex, "ordered");
  
    handleClose();
    setTableNumber("");
    setPartySize(1);
    setOrders([]);
  };


  const handleNextStage = (index) => {
    setData((prevData) =>
      prevData.map((order, i) => {
        if (i === index) {
          const newStage = Math.min(order.stage + 1, 3); // Allow stage to progress to 3
  
          // Update table status based on the new stage
          const tableIndex = parseInt(order.tableNumber, 10) - 1;
          const tableStatusMap = {
            1: "orderReceived", 
            2: "needsPayment",  
            3: "needsCleaned", 
          };
  
          if (tableStatusMap[newStage]) {
            handleTableAction(tableIndex, tableStatusMap[newStage]);
          }
  
          return { ...order, stage: newStage };
        }
        return order;
      })
    );
  };



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
                  <Form.Group className="mb-3">
                    <Form.Label>Table Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </Form.Group>

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
                        orders={order.orders || []}
                        stage={order.stage} 
                        onNextStage={() => handleNextStage(index)} 
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
            <Button variant="outline-dark" className="w-100" onClick={handleShowTables}>
              Tables
            </Button>

            <Modal show={showTables} onHide={handleCloseTables}>
              <Modal.Header closeButton>
                <Modal.Title>Tables</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="d-flex flex-wrap">
                  {tableStates.map((table, index) => {
                    // Define styles and button properties based on the status
                    const statusConfig = {
                      default: { color: "white", text: "Start", next: "seated" },
                      seated: { color: "purple", text: "Table Seated", next: "ordered" },
                      ordered: { color: "yellow", text: "Table Ordered", next: "orderReceived" },
                      orderReceived: { color: "orange", text: "Food Received", next: "needsCleaned" },
                      needsCleaned: { color: "red", text: "Needs Cleaned", next: "default" },
                    };

                    const { color, text, next } = statusConfig[table.status] || {};

                    return (
                      <div
                        key={index}
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundColor: color,
                          margin: "5px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                      >
                        <p style={{ margin: "0", fontSize: "12px" }}>Table {index + 1}</p>
                        {table.status !== "needsCleaned" ? (
                          <Button
                            size="sm"
                            onClick={() => handleTableAction(index, next)}
                          >
                            {text}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline-dark"
                            onClick={() => handleTableAction(index, "default")}
                          >
                            Table Needs Cleaned
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseTables}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

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
