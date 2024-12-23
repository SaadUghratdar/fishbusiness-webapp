import React, { useState } from 'react';
import './dateStyles.css';

function DateInput({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onDateChange(date); // Invoke callback function with selected date
  }
  
  return (
    <div className="dateWrapper">
      <div className="date-input-container">
        <label htmlFor="dateInput">Date:</label>
        <input
          type="date"
          id="dateInput"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

export default DateInput;
