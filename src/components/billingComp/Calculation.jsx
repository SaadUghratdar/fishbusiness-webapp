import React from "react";

function Calculation({ label, value }) {
    return (
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    );
  }
  
  export default Calculation;
  