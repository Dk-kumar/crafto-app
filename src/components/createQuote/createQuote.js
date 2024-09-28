import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createQuote.style.scss";
const CreateQuote = ({setToken}) => {
  const [formData, setFormData] = useState({ text: "", mediaUrl: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setFormData((prev) => ({ ...prev, mediaUrl: data[0].url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch("https://assignment.stage.crafto.app/postQuote", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      navigate("/quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  };


  const handleLogOut = () => {
    setToken(localStorage.removeItem("token"))
    navigate("/login");

  }

  return (
    <div className="CreateQuote_Wrapper">
      <div className="Header">
        <h2>Create Quote</h2>
        <div className="LogOut">
          <button onClick={handleLogOut}>Log out</button>
        </div>
      </div>

      <div className="Input_Wrapper">
        <input
          type="text"
          name="text"
          className="Quote_text"
          placeholder="Quote text"
          value={formData.text}
          onChange={handleInputChange}
        />
        <input type="file" onChange={handleImageUpload} />
        <button
          onClick={handleSubmit}
          disabled={!formData.mediaUrl || !formData.text}
        >
          Submit Quote
        </button>
      </div>
    </div>
  );
};

export default CreateQuote;
