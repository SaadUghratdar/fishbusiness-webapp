import React, {useState} from 'react'
// import '../styles/cashcounter.css'
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import AddSupplier from '../components/AddSupplier'
// import Accordion from '@mui/material/Accordion';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import { FaAngleDown } from "react-icons/fa";



const CashCounter = () => {
  // const [expanded, setExpanded] = React.useState(false);

  // const handleChange = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  // const supplierNames = [
  //   {
  //     id: 'supp01',
  //     name: 'Krish'
  //   },
  //   {
  //     id: 'supp02',
  //     name: 'Saad'
  //   }
  // ];

  // return (
    // <>
    //   <Container disableGutters={true} className="mainDiv" >
    //     {supplierNames.map((supp, index) => (
    //       <Box key={supp.id} sx={{marginTop:'2rem',backgroundColor:' hsl(190, 20%, 58%,0.2)',padding:'10px',borderRadius:'7px'}}>
    //         <Accordion
    //           expanded={expanded === supp.name}
    //           onChange={handleChange(supp.name)}
    //         >
    //           <AccordionSummary
    //             expandIcon={<FaAngleDown />}
    //             aria-controls={`panel-${supp.name}-content`}
    //             id={`panel-${supp.name}-header`}
    //           >
    //            <h1>{supp.name} </h1>
    //           </AccordionSummary>
    //           <AccordionDetails>
    //               <AddSupplier />
    //           </AccordionDetails>
    //         </Accordion>
    //       </Box>
    //     ))}
    //   </Container>
    // </>
  // );

  return (
    <div><h1>CASH COUNTER</h1></div>
  )
};

export default CashCounter;
