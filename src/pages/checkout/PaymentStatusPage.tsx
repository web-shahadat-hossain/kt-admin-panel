import React from "react";
import { useParams } from "react-router-dom";

const PaymentStatusPage: React.FC = () => {
  const { status } = useParams<{ status: string }>();

  const queryParam = new URLSearchParams(window.location.search);
  const orderId = queryParam.get("orderId");

  const goBackToApp = () => {
    window.location.href = `kt://payment-${status}?orderId=${orderId}`;
  };

  const isSuccess = status === "success";
  const containerStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: isSuccess
      ? "linear-gradient(135deg, #4caf50, #81c784)"
      : "linear-gradient(135deg, #f44336, #e57373)",
    color: "#fff",
  };

  const iconStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: isSuccess ? "#4caf50" : "#f44336",
    fontSize: "50px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const buttonStyle: React.CSSProperties = {
    background: "#fff",
    color: isSuccess ? "#4caf50" : "#f44336",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.3s",
  };

  return (
    <div style={containerStyle}>
      <div
        className="container"
        style={{ textAlign: "center", animation: "fadeIn 1s ease-in-out" }}
      >
        <div style={iconStyle}>{isSuccess ? "\u2713" : "\u2715"}</div>
        <h1>{isSuccess ? "Payment Successful" : "Payment Failed"}</h1>
        <p>
          {isSuccess
            ? "Your payment has been processed successfully. Thank you!"
            : "Unfortunately, your payment could not be processed. Please try again."}
        </p>
        <button style={buttonStyle} onClick={goBackToApp}>
          Back to App
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
