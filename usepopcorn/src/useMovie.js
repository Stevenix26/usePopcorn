import { useState, useEffect } from "react";
const KEY = "aea9e7cc";


export function useMovie(query,) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(
        () => {
            // callback?.();
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
                    // console.log(data);

                    if (data.Response === "False") throw new Error("Movie not found");
                    setMovies(data.Search);
                    setError("");
                } catch (err) {
                    // If the error is an AbortError, it means the fetch was aborted, so we don't want to set an error state
                    // This is useful to prevent showing an error message when the user types a new query before the previous fetch completes
                    // This way, we only show errors that are not related to the fetch being aborted
                    if (err.name !== "AbortError") {
                        setError(err.message);
                        // console.log(err.message);

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
            

            // Fetch movies only if the query length is at least 3 characters
            fetchMovies();

            // Cleanup function to abort the fetch request if the component unmounts or if the query changes
            return () => {
                controller.abort();
            };
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [query]
    );
    return { movies, isLoading, error, setMovies, setIsLoading, setError };

}