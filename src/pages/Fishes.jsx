import {React,useState} from 'react'
import '../styles/fishStyles.css'
const Fishes = () => {
    const [fishInputs, setFishInputs] = useState({ fishName: ''});
  const [fishes, setFishes] = useState([]);

  const handleAddFish = (e) => {
    e.preventDefault();
    // if (suppInputs.suppName.trim() !== '' && suppInputs.boxes !== '' && suppInputs.pieces !== '') {
      setFishes([fishInputs,...fishes]);
      setFishInputs({ fishName: '' });
    // } else {
    //   // Notify the user that all fields are required
    //   alert('Please fill in all fields');
    // }
  };

  return (
    <>
    <div class="scrollableTable">
    <div className="tableWrapper">
      <div className="fishInputContainer">
        <form onSubmit={handleAddFish}>
          <input
            className='fishInputName'
            type="text"
            placeholder="Fish Name"
            value={fishInputs.fishName}
            onChange={(e) => setFishInputs({ ...fishInputs, fishName: e.target.value })}
          />
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