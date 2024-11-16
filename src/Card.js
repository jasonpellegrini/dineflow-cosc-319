import React from "react";
import { Card as BootstrapCard } from "react-bootstrap";

function Card({ tableNumber, partySize, orders }) {
  return (
    <BootstrapCard className="mb-3">
      <BootstrapCard.Body>
        <BootstrapCard.Title>Table #{tableNumber}</BootstrapCard.Title>
        <BootstrapCard.Text>
          <strong>Party Size:</strong> {partySize}
        </BootstrapCard.Text>
        <BootstrapCard.Text>
          <strong>Orders:</strong>
          <ul>
            {orders.map((order, index) => (
              <li key={index}>{order || "No order selected"}</li>
            ))}
          </ul>
        </BootstrapCard.Text>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;