import React, { useState } from 'react';
import '../css/Unilist.css';

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch universities from backend by country
  const handleSearch = () => {
    if (!searchTerm) {
      alert("Please enter a country name to search.");
      return;
    }

    fetch(`http://localhost:5000/universities/${searchTerm}`)
      .then(res => res.json())
      .then(data => {
        setUniversities(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load university data. Please try again later.');
      });
  };

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const calculateTimeLeft = (deadline) => {
    const difference = new Date(deadline) - new Date();
    if (difference <= 0) return { expired: true };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return {
      expired: false,
      soon: days <= 7,
      days,
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  return (
    <div className="uni-wrapper">
      <h1 className="uni-title">📅 University Deadline Tracker</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter country name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {universities.length > 0 ? (
        universities.map((uni, index) => {
          const countdown = calculateTimeLeft(uni.deadline);
          return (
            <div key={uni._id} className="uni-card">
              <div className="uni-header">
                <div>
                  <h2>{uni.name}</h2>
                  <p className="uni-country">{uni.country}</p>
                </div>
                <button
                  className={`details-btn ${openIndex === index ? 'active' : ''}`}
                  onClick={() => toggleDetails(index)}
                >
                  {openIndex === index ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {openIndex === index && (
                <div className="uni-details">
                  <p><strong>🎓 Details:</strong> {uni.details}</p>
                  <p><strong>📌 Requirements:</strong> {uni.requirements}</p>
                  <p><strong>⏰ Deadline:</strong> {new Date(uni.deadline).toLocaleString()}</p>
                  <a href={uni.website} target="_blank" rel="noopener noreferrer" className="uni-link">
                    🔗 Visit Official Website
                  </a>
                </div>
              )}

              <div className={`countdown-box ${countdown.expired ? 'expired' : ''}`}>
                {countdown.expired ? (
                  <span className="expired-text">⛔ Deadline Passed</span>
                ) : (
                  <>
                    <span>
                      🕒 {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s left
                    </span>
                    {countdown.soon && (
                      <span className="soon-badge">⚠️ Deadline Soon</span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-results">No universities found for that country.</p>
      )}
    </div>
  );
};

export default UniversityList;
