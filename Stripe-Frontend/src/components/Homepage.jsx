import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const hardcodedAmount = 50000000; // in cents

  const handlePayClick = async (email) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/create-payment-intent/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: hardcodedAmount,
            currency: currency,
            user_email: email,
          }),
        }
      );

      const data = await response.json();
      if (data.clientSecret) {
        navigate("/payment", { state: { clientSecret: data.clientSecret } });
      } else {
        alert("Error creating payment intent.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating payment intent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>React Stripe Payment</h1>
      <p>
        <strong>Amount:</strong> {hardcodedAmount}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || email.trim() == "") {
            return;
          }

          handlePayClick(email);
        }}
      >
        <label htmlFor="email">Enter your email:</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          name="email"
          id="email"
          type="email"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

export default Homepage;
