import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.style.scss";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: "", otp: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://assignment.stage.crafto.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        setErrorMessage("Something went wrong. Please check your username or OTP.");
        setHasError(true);
        return;
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/quotes");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
      setHasError(true);
    }
  };

  return (
    <div className="Login_Container">
      <div className="Login_Wrapper">
        <h2 className="Heading">Login</h2>
        <div className="Input_Wrapper">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className={hasError ? "Input_Error" : ""}
          />
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleInputChange}
            className={hasError ? "Input_Error" : ""}
          />

          {errorMessage && <p className="Error_Message">{errorMessage}</p>}

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
