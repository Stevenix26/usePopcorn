# Code Citations

## License: unknown

https://github.com/taroserigano/React_and_Redux_Specials/tree/014304f949544193db9351d8139467cdd6eebd42/John-React-Redux-Projects/07-usepopcorn/final/src/App-v2.js

```
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(
```

## License: unknown

https://github.com/xkwhdkf/react_practice/tree/3120cbab8749d3223592ba7efca56c71ba304edf/ultimate-react-course-main/07-usepopcorn/final/src/App-v2.js

```
, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] =
```

## License: unknown

https://github.com/buraksenses/Movieflix/tree/d5523e8c07c61857bf2229388b10641ef6d70363/src/App.js

```
, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(
```

## License: unknown

https://github.com/JacceyCode/movie-app-react-tutorial/tree/e750844871bb259e4d10495dfc68d31fe723b5a6/src/App-v2.js

```
[isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId
```

## License: unknown

https://github.com/Sizzlesina/Jonas-react/tree/eff8a6428c16081512433f687ee83f951eddb696/07-usepopcorn/src/components/AppV2.js

```
async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (
```
