// AddSupplier.js
import "../App.css";
import React, { useState } from "react";
import { Tabs, Tab, Button, TextField } from "@mui/material";
import { SiX } from "react-icons/si";
import "../styles/cashcounter.css";

const AddSupplier = () => {
  const [tabs, setTabs] = useState([]);
  const [value, setValue] = useState(0);
  const [tabName, setTabName] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});

  const handleAddTab = () => {
    const newTabs = [...tabs, tabName];
    setTabs(newTabs);
    setTabName("");
    setValue(newTabs.length - 1); // Select the newly added tab
  };

  const handleInputChange = (event, rowKey) => {
    const { name, value } = event.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [rowKey]: {
        ...prevDetails[rowKey],
        [name]: value,
      },
    }));
  };

  const handleAddRow = (tabIndex) => {
    const newRowKey = `${tabs[tabIndex]} - Row ${
      Object.keys(customerDetails).filter((key) =>
        key.startsWith(`${tabs[tabIndex]} - Row `)
      ).length + 1
    }`;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [newRowKey]: {},
    }));
  };

  return (
    <div>
      <TextField
        label="Fish Name"
        value={tabName}
        onChange={(e) => setTabName(e.target.value)}
        sx={{
          width: "200px",
          height: "15px",
          fontSize: "12px",
          padding: "1px",
          content: '""',
        }}
      />
      <Button
        onClick={handleAddTab}
        variant="contained"
        color="primary"
        className="btn-addFish"
      >
        Add Fish
      </Button>

      <Tabs
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ marginTop: "30px" }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

      {/* Render content for the selected tab */}
      {tabs.map((tab, index) => (
        <div key={index} hidden={value !== index}>
          <form>
            {Object.entries(customerDetails)
              .filter(([key]) => key.startsWith(`${tab} - Row `))
              .map(([rowKey, row]) => (
                <div key={rowKey}>
                  <h4>{rowKey}</h4>
                  {Object.entries(row).map(([name, value]) => (
                    <TextField
                      key={name}
                      label={name}
                      name={name}
                      value={value}
                      onChange={(event) => handleInputChange(event, rowKey)}
                      margin="normal"
                      variant="outlined"
                    />
                  ))}
                </div>
              ))}

            <Button
              onClick={() => handleAddRow(index)}
              variant="outlined"
              color="primary"
              style={{ marginTop: "1rem" }}
            >
              Add Row
            </Button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AddSupplier;
