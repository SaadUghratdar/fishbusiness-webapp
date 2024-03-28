import {React,useState,useEffect} from 'react'
import axios from 'axios';
import '../styles/fishStyles.css'
const Fishes = () => {
  const [fishInputs, setFishInputs] = useState({ fishname: ''});
  const [fishes, setFishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedFishId,setSelectedFishId]=useState(null);


  useEffect(() => {
    const fetchFishes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/fish/show');
        console.log(response.data)
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

    if (!fishInputs.fishname.trim()) {
      alert('Please fill in all required fields!!');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:8000/fish', fishInputs);
  
      console.log("THE RESPONSE:",response.data);
      setFishes([response.data,...fishes]); // Add newly created fish to state
     
      setFishInputs({fishname:''}); // Clear input fields
    } catch (error) {
      console.error('Error adding fish:', error);
      alert('Error adding fish. Please try again.'); // Inform user about error
    } finally {
      setIsLoading(false); // Set loading state to false after adding or error
    }
  };


  //Function to find the index of the editing row
  const handleEditFish=async(fishId)=>{
    setSelectedFishId(fishId);
    const selectedFish=fishes.find((fish)=>fish._id===fishId);
    console.log("in edit ",selectedFish)
    setFishInputs({ fishname: selectedFish.fishName });
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!fishInputs.fishname.trim()) {
      alert('Please fill in all required fields!!');
      return;
    }
    setIsLoading(true);

    try {
  
      const response = await axios.put(`http://localhost:8000/fish/${selectedFishId}`, fishInputs);  

      const updatedFishIndex = fishes.findIndex((fish) => fish._id === selectedFishId);
      setFishes([
        ...fishes.slice(0, updatedFishIndex),
        response.data,
        ...fishes.slice(updatedFishIndex + 1),
      ]);
      setSelectedFishId(null); // Clear selected supplier after saving
      setFishInputs({fishname:''}); // Clear input fields
    } catch (error) {
      console.error('Error updating Fish:', error);
      alert('Error updating fish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedFishId(null); // Clear selected fish
    setFishInputs({fishname:'' }); // Clear input fields
  };
  
  const handleDeleteFish = async (fishId) => {
    if (!window.confirm('Are you sure you want to delete this fish?')) {
      return;
    }

    setIsLoading(true);

    try {
      const response=await axios.delete(`http://localhost:8000/fish/${fishId}`); 
      console.log(response);
      setFishes(fishes.filter((fish) => fish._id !== fishId));
    } catch (error) {
      console.error('Error deleting fish:', error);
      alert('Error deleting fish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <>
    <div class="scrollableTable">
    <div className="tableWrapper">
      <div className="fishInputContainer">
        <form onSubmit={selectedFishId ? handleSaveEdit : handleAddFish}>
          <input
            className='fishInputName'
            id="autocompleteInput"
            list="datalistOptions" 
            type="text"
            placeholder="Fish Name"
            value={fishInputs.fishname}
            onChange={(e) => setFishInputs({ ...fishInputs, fishname: e.target.value })}
          />
          <datalist id="datalistOptions">
            <option value="San Francisco"/>
            <option value="New York"/>
            <option value="Seattle"/>
            <option value="Los Angeles"/>
            <option value="Chicago"/>
          </datalist>
          {selectedFishId===null
          ? 
          <button type="submit">ADD</button>
           :
          <>
           <button type="submit">SAVE</button>
          <button onClick={handleCancelEdit}>CANCLE</button>
          </>
          } 
         
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
              <button onClick={() => handleEditFish(fish._id)}>EDIT</button>
              {/* onClick={handleEditFish(fish._id)} */}
              <button onClick={() => handleDeleteFish(fish._id)}>DELETE</button>
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