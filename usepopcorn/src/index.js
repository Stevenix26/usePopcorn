import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';


// function Test(){

//   const [movieRating, setMovieRating] = useState(0);

//   return ( 
//     <div>
//       <StarRating color="blue" maxRating={10} onMovieRating={setMovieRating}/>
//       <p>This movie is Rated {movieRating} stars</p>
//     </div>
//   )
// }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5}
      message={["Terrible","Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating maxRating={10} size={30} color="green" classname="text" />
    <Test/> */}

  </React.StrictMode>
);

