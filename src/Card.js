import React from "react";
import { Card as BootstrapCard, Button } from "react-bootstrap";

function Card({ tableNumber, partySize, orders, stage, onNextStage }) {
  // Define button properties based on the current stage
  const buttonConfig = {
    0: { text: "Food Served", variant: "warning" },
    1: { text: "Payment Received", variant: "danger" },
    2: { text: "Complete Order", variant: "success" },
    3: { text: "Order Complete", variant: "secondary" }, // Final stage, no further action
  };

  const { text, variant } = buttonConfig[stage] || {};

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
        {/* Stage Button */}
        <Button
          variant={variant}
          size="sm"
          onClick={onNextStage}
          disabled={stage >= 3} // Only disable after stage 3
        >
          {text}
        </Button>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;