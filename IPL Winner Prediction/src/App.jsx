import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Swal from 'sweetalert2';

function App() {
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [venue, setVenue] = useState([]);

  const [data, setData] = useState({
    "team1": "Select First Team",
    "team2": "Select Second Team",
    "venue": "Select Venue",
  });

  useEffect(() => {
    fetch('/assets/team1.json').then(async (res) => {
      const data = await res.json();
      setTeam1(data);
    })
      .catch(error => console.error('Error fetching the team list:', error));

    fetch('/assets/team2.json').then(async (res) => {
      const data = await res.json();
      setTeam2(data);
    })
      .catch(error => console.error('Error fetching the team list:', error));

    fetch('/assets/venue.json').then(async (res) => {
      const data = await res.json();
      setVenue(data);
    })
      .catch(error => console.error('Error fetching the team list:', error));
  }, []);

  const formattedTeam1 = team1.map((team) => {
    return (
      <li onClick={() => handleSelectTeam1(team)}><a class="dropdown-item" href="#">{team}</a></li>
    )
  })

  const formattedTeam2 = team2.map((team) => {
    return (
      <li onClick={() => handleSelectTeam2(team)}><a class="dropdown-item" href="#">{team}</a></li>
    )
  })

  const formattedVenue = venue.map((venuee) => {
    return (
      <li onClick={() => handleSelectVenue(venuee)}><a class="dropdown-item" href="#">{venuee}</a></li>
    )
  })

  const handleSelectTeam1 = (team) => {
    setData((prevData) => ({
      ...prevData,
      "team1": team,
    }));
  };

  const handleSelectTeam2 = (team) => {
    setData((prevData) => ({
      ...prevData,
      "team2": team,
    }));
  };

  const handleSelectVenue = (venue) => {
    setData((prevData) => ({
      ...prevData,
      "venue": venue,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault()
    if(data.team1 == 'Select First Team'){
      Swal.fire({
        title: "Alert",
        text:"Please Select First Team",
        icon: "error"
      });
      return;
    }
    if(data.team2 == 'Select Second Team'){
      Swal.fire({
        title: "Alert",
        text:"Please Select Second Team",
        icon: "error"
      });
      return;
    }
    if(data.venue == 'Select Venue'){
      Swal.fire({
        title: "Alert",
        text:"Please Select Venue",
        icon: "error"
      });
      return;
    }
    fetch('http://127.0.0.1:5000/predict', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      const data = await res.json();
      Swal.fire({
        title: "Woww..!",
        html:`Winner Can be <b>${data.winner}!</b>`,
        icon: "success"
      });
    })
  }

  return (
    <form className='h-[85vh] flex flex-col justify-center' onSubmit={(e)=>{
      e.preventDefault();
      handleSubmit(e)
    }}>
      <h1 className='text-7xl text-black' style={{fontFamily:"Brush Script MT"}}>Let's Predict the Winner</h1>
      <div className='flex flex-col items-center'>
        <div class="btn-group my-2 w-25">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            {data.team1}
          </button>
          <ul class="dropdown-menu">
            {formattedTeam1}
          </ul>
        </div>
        <div class="btn-group my-2 w-25">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            {data.team2}
          </button>
          <ul class="dropdown-menu">
            {formattedTeam2}
          </ul>
        </div>
        <div class="btn-group my-2 w-25">
          <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            {data.venue}
          </button>
          <ul class="dropdown-menu">
            {formattedVenue}
          </ul>
        </div>
        <button type='submit' className='btn btn-info my-4 w-25'>Predict</button>
      </div>
    </form>
  )
}

export default App
