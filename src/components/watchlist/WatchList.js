import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './WatchList.css';

const WatchList = ({ userId }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [showAllMovies, setShowAllMovies] = useState(false);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/movies/watchlist/${userId}`);
            setWatchlist(response.data);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    const fetchAllMovies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/movies');
            setAllMovies(response.data);
        } catch (error) {
            console.error('Error fetching all movies:', error);
        }
    };

    const addToWatchlist = async (imdbId) => {
        try {
            // Check if the movie with imdbId is already in the watchlist
            const isAlreadyAdded = watchlist.some(movie => movie.imdbId === imdbId);
    
            if (isAlreadyAdded) {
                console.log('Movie is already in the watchlist');
                // Show feedback to the user that the movie is already in the watchlist
                // You can set a state to display a message or use another approach for feedback
                return;
            }
    
            // If movie is not already in watchlist, proceed with adding
            await axios.post(`http://localhost:8080/api/v1/movies/${imdbId}/${userId}/add-to-watchlist`);
            fetchWatchlist();
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
        }
    };

    const removeFromWatchlist = async (imdbId) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/movies/${imdbId}/${userId}/remove-from-watchlist`);
            fetchWatchlist();
        } catch (error) {
            console.error('Error removing movie from watchlist:', error);
        }
    };

    const openAllMovies = async () => {
        try {
            await fetchAllMovies();
            setShowAllMovies(true);
        } catch (error) {
            console.error('Error fetching all movies:', error);
        }
    };

    const closeAllMovies = () => {
        setShowAllMovies(false);
    };

    return (
        <div>
            <h2>Watchlist</h2>
            <ul className="watchlist">
                {watchlist.map(movie => (
                    <li key={movie.imdbId} className="watchlist-item">
                        <div className="movie-info">
                            <h3>{movie.title}</h3>
                            <img src={movie.poster} alt={movie.title} className="movie-poster" />
                        </div>
                        <button onClick={() => removeFromWatchlist(movie.imdbId)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={openAllMovies}>Add Movie</button>

            {showAllMovies && (
                <div className="all-movies-container">
                    <button onClick={closeAllMovies}>Close</button>
                    <h3>All Movies</h3>
                    <div className="movies-list">
                        {allMovies.map(movie => (
                            <div key={movie.imdbId} className="movie-item">
                                <img src={movie.poster} alt={movie.title} className="movie-poster2" />
                                <h4>{movie.title}</h4>
                                <button onClick={() => addToWatchlist(movie.imdbId)}>Add to Watchlist</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchList;
