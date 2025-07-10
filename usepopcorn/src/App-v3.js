import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const KEY = "aea9e7cc";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);


  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovies(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      // AbortController is used to cancel the fetch request if the component unmounts or if the query changes before the fetch completes
      // This prevents memory leaks and unnecessary network requests
      // If the component unmounts or the query changes, the fetch request will be aborted
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          console.log(data);

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          // If the error is an AbortError, it means the fetch was aborted, so we don't want to set an error state
          // This is useful to prevent showing an error message when the user types a new query before the previous fetch completes
          // This way, we only show errors that are not related to the fetch being aborted
          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err.message);

          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovies();

      // Fetch movies only if the query length is at least 3 characters
      fetchMovies();
      
      // Cleanup function to abort the fetch request if the component unmounts or if the query changes
      return () => {
        controller.abort();
      };
    },
    [query]
  );

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
    <div className="box">
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
    <ul className="list">
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
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
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

  const isWatched = watched.map((movie) => movie.imbID).includes(selectedId);

  const watchedUserrating = watched.find(movie => movie.imbID === selectedId)?.userRating;

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

  function handleAdd() {
    const newMovie = {
      imbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newMovie);
    onCloseMovie();
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

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();

      }
    }
    document.addEventListener("keydown", callback);
    // Cleanup function to remove the event listener
    return function () {
      document.removeEventListener("keydown", callback);
    }

  }, [onCloseMovie]);


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
      <img src={movie.poster} alt={`${movie.title} poster`} />
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
        <button className="btn-delete" onClick={() => onRemoveMovie(movie.imbID)}>
          ❌
        </button>
      </div>
      <div>

      </div>
    </li>
  );
}
