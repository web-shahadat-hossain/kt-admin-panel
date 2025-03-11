import React, { useEffect, useState } from "react";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import {
  ApiBaseurl,
  ApiBaseurl2,
  checkout,
  verifyPay,
} from "@/utils/constants/ApiEndPoints";

interface CheckoutData {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId: string;
  email: string;
  contact: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const { error, isLoading, Razorpay } = useRazorpay();
  const [searchParams] = useSearchParams();
  const receiptId = searchParams.get("receiptId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${ApiBaseurl2}${checkout}`, {
          receiptId,
        });

        setCheckoutData(response.data.data);
      } catch (error: any) {
        console.error("Error fetching checkout data:", error);
        swal("Oops!", error.message, "error");
      }
    };

    if (receiptId) fetchData();
  }, [receiptId]);

  const payNow = () => {
    if (!checkoutData) return;

    const options: RazorpayOrderOptions = {
      key: checkoutData.key,
      amount: checkoutData.amount,
      currency: "INR",
      name: checkoutData.name,
      description: checkoutData.description,
      order_id: checkoutData.orderId,
      prefill: {
        name: checkoutData.name,
        email: checkoutData.email,
        contact: checkoutData.contact,
      },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verificationResponse = await axios.post(
            `${ApiBaseurl2}${verifyPay}`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verificationResponse.data.status === "ok") {
            navigate(`/payment-status/success?orderId=${checkoutData.orderId}`);
          } else {
            navigate(`/payment-status/failed?orderId=${checkoutData.orderId}`);
          }
        } catch (error: any) {
          console.error("Error verifying payment:", error);
          swal("Oops!", error.message, "error");
        }
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  if (!checkoutData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
      }}
      aria-disabled={!isLoading}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "90%",
          padding: "20px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}
        >
          Secure Checkout
        </div>
        <div
          style={{
            textAlign: "left",
            marginBottom: "20px",
            fontSize: "0.95rem",
            color: "#555",
          }}
        >
          <p>
            <strong>Order ID:</strong> {checkoutData.orderId}
          </p>
          <p>
            <strong>Amount:</strong> {checkoutData.amount / 100}
          </p>
          <p>
            <strong>Currency:</strong> {checkoutData.currency}
          </p>
          <p>
            <strong>Description:</strong> {checkoutData.description}
          </p>
          <p>
            <strong>Name:</strong> {checkoutData.name}
          </p>
          <p>
            <strong>Email:</strong> {checkoutData.email}
          </p>
          <p>
            <strong>Contact:</strong> {checkoutData.contact}
          </p>
        </div>
        <button
          onClick={payNow}
          style={{
            backgroundColor: "#387ADE",
            color: "#fff",
            fontSize: "1.1rem",
            padding: "12px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            width: "100%",
          }}
        >
          Proceed to Checkout
        </button>
        <p>{error && <p>Error loading Razorpay: {error}</p>}</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
