import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./quotesList.style.scss";
const QuotesList = ({ setToken }) => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchQuotes = useCallback(
    async (currentPage) => {
      try {
        const response = await fetch(
          `https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${
            currentPage * 20
          }`,
          {
            headers: { Authorization: token },
          }
        );

        const data = await response.json();

        setHasMore(data.data.length === 20);
        setQuotes(data.data);
      } catch (error) {
        console.error("Error fetching quotes", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchQuotes(page);
  }, [page, fetchQuotes]);

  const handleNext = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const handleLogOut = () => {
    setToken(localStorage.removeItem("token"));
    navigate("/login");
  };

  return (
    <div className="QuotesList_Container">
      <div className="Header">
        <h2>Quotes List</h2>

        <div className="Left_header">
          <div>
            <Link to="/create-quote">
              <button>Create Quote</button>
            </Link>
          </div>

          <div className="LogOut">
            <button onClick={handleLogOut}>Log out</button>
          </div>
        </div>
      </div>
      <div className="Create_btn">
        <Link to="/create-quote">
          <button>Create Quote</button>
        </Link>
      </div>
      <div className="Lists_Wrapper">
        {quotes.map((quote, index) => (
          <>
            {
              <div key={index} className="List_Card">
                <img src={quote.mediaUrl} alt="quote" />
                <div className="Quote_Text">{quote.text}</div>
                <div className="Quote_Date">
                  {quote.username} -{" "}
                  {new Date(quote.created_at).toLocaleString()}
                </div>
              </div>
            }
          </>
        ))}
      </div>

      <div className="Buttons_Wrapper">
        <button onClick={handlePrevious} disabled={page === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
};

export default QuotesList;
