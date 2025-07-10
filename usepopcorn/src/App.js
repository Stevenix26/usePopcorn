import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const KEY = "aea9e7cc";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovie(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");




  // eslint-disable-next-line
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovies(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    //   localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  // Save the watched movies to localStorage

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      {/* //structural Component */}

      <Main>
        {/* //using Explicit children props
        <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovies={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={handleCloseMovies}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onRemoveMovie={handleDeleteMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader"> Loading.... </p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  //Fixed Prop Drilling bY Using Component Composition "Using the Children prop'
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

function Logo() {
  return (
    //presentational Comp
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Search({ query, setQuery }) {

  const inputRef = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputRef.current) return;
    // If the input is already focused, we don't want to do anything
    inputRef.current.focus();
    setQuery("");
    console.log("Enter key pressed, focusing input and clearing query");
  }); 


  // useEffect(() => {
  //   // This effect will run only once when the component mounts
  //   // It sets the focus on the search input element

  //   function callback(e) {
  //     if (document.activeElement === inputRef.current) return;
  //     // If the input is already focused, we don't want to do anything

  //     if (e.code === "Enter") {
  //       inputRef.current.focus();
  //       setQuery("");
  //       console.log("Enter key pressed, focusing input and clearing query");

  //     }
  //     // setQuery(inputRef.current.value);
  //   }

  //   document.addEventListener("keydown", callback);

  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //     console.log("Cleanup: removing event listener for keydown");
  //     // Cleanup function to remove the event listener when the component unmountsentListener("keydown", callback);
  //   };


  // }, [inputRef, setQuery]);


  // useEffect(()=>{
  //   const el = document.querySelector(".search"); 
  //   console.log(el)
  //   el.focus();
  //   // This effect will run only once when the component mounts
  //   // It sets the focus on the search input element
  //   // This is useful to improve user experience by allowing the user to start typing immediately without having
  //   // to click on the input field first

  // }, []);



  function handleQuery(e) {
    setQuery(() => e.target.value);
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleQuery}
      ref={inputRef} // Using useRef to focus the input element
    />
  );
}
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box ">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <MovieWatch>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </MovieWatch>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovies }) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          onSelectMovies={onSelectMovies}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovies }) {
  return (
    <li onClick={() => onSelectMovies(movie.imdbID)}>
      <img src={movie?.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function MovieWatch({children}) {

//   return (
//     <>
//       {children}
//     </>
//   );
// }

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [selectMovie, setSelectMovie] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserrating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

  const countRef = useRef(0);
  // useRef is used to persist the value across renders without causing re-renders
  useEffect(() => {
    if (userRating) countRef.current++;

  }, [userRating]);
  // This effect will run only once when the component mounts

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectMovie;

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(() => {
  //   setIsTop(imdbRating > 8);
  // }, [imdbRating]);

  // const [average, setAverage] = useState(0);
  // useEffect(() => {
  //   const avg = (average + userRating) / 2;
  //   setAverage(avg);
  // }
  // , [average, userRating]);

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newMovie);
    onCloseMovie();
    // setAverage(Number(imdbRating));
    // setAverage((average)=> (average + userRating) / 2);

    // Reset user rating after
  }

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();

        setSelectMovie(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    }
    getMovieDetails();
  }, [selectedId]);


  useEffect(function () {
    if (!title) return;
    // Update the document title using the browser API
    document.title = `Details of ${title}`;
    //Clean up function
    return () => {
      // This function will be called when the component unmounts or before the effect runs again
      document.title = 'usePopcorn';
    };
  }, [title]);

  useKey("Escape", onCloseMovie);


  return (
    <div className="details" style={{ padding: "10px" }}>
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button
              className="btn-back"
              onClick={() => onCloseMovie(selectedId)}
            >
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${poster}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐ {imdbRating} IMDb rating</p>
            </div>
          </header>
          {/* <p className="average">
          {average.toFixed(2)} ⭐️ average rating
        </p> */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={10}
                    onMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already watched this movie {title} and also rated {watchedUserrating} {" "}
                  <span role="img" aria-label="movie">
                    🌟
                  </span>
                </p>
              )}

              {/* 

              {isWatched.includes(selectedId) && (
                <p>
                  You already watched this movie{" "}
                  <span role="img" aria-label="movie">
                    🎬
                  </span>
                </p>
              )}
              {userRating <= 0 && !isWatched.includes(selectedId) && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            
              {isWatched.includes(selectedId) && (
                <button className="btn-remove" onClick={onCloseMovie}>
                  Remove from list
                </button>
              )} */}
            </div>
            <em>{plot}</em>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  //Presenatational Comp
  const avgImdbRating = average?.(watched?.map((movie) => movie?.imdbRating || 0)) || 0;
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onRemoveMovie }) {


  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onRemoveMovie={onRemoveMovie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onRemoveMovie }) {

  return (
    <li>
      <img src={movie?.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onRemoveMovie(movie.imdbID)}>
          ❌
        </button>
      </div>
      <div>

      </div>
    </li>
  );
}

