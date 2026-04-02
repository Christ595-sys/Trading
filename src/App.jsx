import { useEffect, useState } from "react";
import "./App.css";

const checklistItems = [
  "Trend is in one direction",
  "AOI is in discount zone in 4H TF",
  "4H candle close in AOI",
  "15M MS retest AOI in 15M (wick or no wick is the same)",
];

const initialForm = {
  pair: "",
  type: "Buy",
  lotSize: "",
  date: "",
  balance: "",
};

export default function App() {
  const [checkedItems, setCheckedItems] = useState(
    Array(checklistItems.length).fill(false)
  );
  const [probability, setProbability] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [tradeForm, setTradeForm] = useState(initialForm);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const savedTrades = localStorage.getItem("tradeJournal");
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tradeJournal", JSON.stringify(trades));
  }, [trades]);

  const toggleItem = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const calculateProbability = () => {
    const checkedCount = checkedItems.filter(Boolean).length;
    const result = ((checkedCount / checklistItems.length) * 90).toFixed(2);
    setProbability(result);
  };

  const resetAll = () => {
    setCheckedItems(Array(checklistItems.length).fill(false));
    setProbability(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTradeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTrade = () => {
    if (
      !tradeForm.pair ||
      !tradeForm.type ||
      !tradeForm.lotSize ||
      !tradeForm.date ||
      !tradeForm.balance
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newTrade = {
      id: Date.now(),
      ...tradeForm,
    };

    setTrades((prev) => [newTrade, ...prev]);
    setTradeForm(initialForm);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Trade Probability Checklist</h1>

        <div className="checklist">
          {checklistItems.map((item, index) => (
            <button
              key={index}
              className={`check-button ${checkedItems[index] ? "active" : ""}`}
              onClick={() => toggleItem(index)}
            >
              <span className="icon">{checkedItems[index] ? "✔" : "○"}</span>
              {item}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="calculate-btn" onClick={calculateProbability}>
            Calculate
          </button>

          <button className="reset-btn" onClick={resetAll} title="Reset">
            ↻
          </button>

          <button
            className="calendar-btn"
            onClick={() => setShowJournal(!showJournal)}
            title="Open Trade Journal"
          >
            📅
          </button>
        </div>

        <div className="rules">
          <h3>Rules:</h3>
          <ul>
            <li>No news</li>
            <li>Risk: 5% of balance</li>
            <li>Minimum 1:2 (R:R)</li>
          </ul>
        </div>

        {probability !== null && (
          <div className="result">
            <h2>Trade Probability: {probability}%</h2>
            <p>Maximum possible probability is 90%</p>
          </div>
        )}

        {showJournal && (
          <div className="journal-section">
            <h2>Trade Journal</h2>

            <div className="trade-form">
              <input
                type="text"
                name="pair"
                placeholder="Pair"
                value={tradeForm.pair}
                onChange={handleInputChange}
              />

              <select
                name="type"
                value={tradeForm.type}
                onChange={handleInputChange}
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>

              <input
                type="number"
                name="lotSize"
                placeholder="Lot size"
                value={tradeForm.lotSize}
                onChange={handleInputChange}
              />

              <input
                type="date"
                name="date"
                value={tradeForm.date}
                onChange={handleInputChange}
              />

              <input
                type="number"
                name="balance"
                placeholder="Balance"
                value={tradeForm.balance}
                onChange={handleInputChange}
              />

              <button className="save-btn" onClick={saveTrade}>
                Save
              </button>
            </div>

            <div className="trade-cards">
              {trades.length === 0 ? (
                <p className="empty-text">No trades saved yet.</p>
              ) : (
                trades.map((trade) => (
                  <div className="trade-card" key={trade.id}>
                    <h3>{trade.pair}</h3>
                    <p>
                      <strong>Type:</strong> {trade.type}
                    </p>
                    <p>
                      <strong>Lot Size:</strong> {trade.lotSize}
                    </p>
                    <p>
                      <strong>Date:</strong> {trade.date}
                    </p>
                    <p>
                      <strong>Balance:</strong> ${trade.balance}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}