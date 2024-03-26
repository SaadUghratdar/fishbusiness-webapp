import {React,useState,useEffect} from 'react'
import axios from 'axios';
import '../styles/fishStyles.css'
const Fishes = () => {
  const [fishInputs, setFishInputs] = useState({ fishName: ''});
  const [fishes, setFishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  

  // useEffect(() => {
  //   axios.get("http://localhost:8000/fish/show").then((response) => {
  //     setFishes(response.data);
  //   });
  // });


  useEffect(() => {
    const fetchFishes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/fish/show');
        setFishes(response.data);
        
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFishes();
  }, []);

  const handleAddFish = async (e) => {
    e.preventDefault();

    // if (!suppInputs.suppName.trim() || !suppInputs.phoneNum.trim()) {
    //   alert('Please fill in all required fields (Supplier Name and Phone Number)');
    //   return;
    // }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:8000/fish', fishInputs); // Replace with your API endpoint
      setFishInputs([...fishInputs, response.data]); // Add newly created supplier to state
      setFishInputs({fishName:''}); // Clear input fields
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Error adding fish. Please try again.'); // Inform user about error
    } finally {
      setIsLoading(false); // Set loading state to false after adding or error
    }
  };

  

  // const handleAddFish = (e) => {
  //   e.preventDefault();
    
  //   // if (suppInputs.suppName.trim() !== '' && suppInputs.boxes !== '' && suppInputs.pieces !== '') {
  //     setFishes([fishInputs,...fishes]);
  //     setFishInputs({ fishName: '' });
  //   // } else {
  //   //   // Notify the user that all fields are required
  //   //   alert('Please fill in all fields');
  //   // }
  // };

  return (
    <>
    <div class="scrollableTable">
    <div className="tableWrapper">
      <div className="fishInputContainer">
        <form onSubmit={handleAddFish}>
          <input
            className='fishInputName'
            id="autocompleteInput"
            list="datalistOptions" 
            type="text"
            placeholder="Fish Name"
            value={fishInputs.fishName}
            onChange={(e) => setFishInputs({ ...fishInputs, fishName: e.target.value })}
          />
          <datalist id="datalistOptions">
            <option value="San Francisco"/>
            <option value="New York"/>
            <option value="Seattle"/>
            <option value="Los Angeles"/>
            <option value="Chicago"/>
          </datalist>
          <button type="submit">ADD</button>
        </form>
      </div>
      
      <table className='fishTable'>
        <thead>
          <tr>
            <th className='fishCol'>Fish</th>
            <th className='actCol'>Action</th>
          </tr>
        </thead>
        <tbody>
          {fishes.map((fish, index) => (
            <tr key={index}>
              <td>{fish.fishName}</td>
              <td>
              <button type="submit">EDIT</button>
              <button type="submit">DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  </>
  )
}

export default Fishes