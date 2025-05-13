import { useState, useEffect } from 'react';

function useMovieDetails(selectedId, apiKey) {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedId) return; // Prevent fetching if no ID is provided

        const fetchMovieDetails = async () => {
            setIsLoading(true);
            setError(null); // Reset error before making a new request
            try {
                const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`);
                const data = await res.json();
                setSelectedMovie(data);
            } catch (err) {
                setError('Failed to fetch movie details.');
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [selectedId, apiKey]); // Dependencies: rerun when selectedId or apiKey changes

    return { selectedMovie, isLoading, error };
}

export default useMovieDetails;
