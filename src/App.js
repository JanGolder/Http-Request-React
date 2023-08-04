import React, { useState, useEffect, useCallback } from "react";
import AddMovie from './components/AddMovie';

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState(null);

  // older version of fetch
  // function fetchMoviesHandler() {
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then(data=>{
  //       const transformedMovies = data.results.map(movieData=>{
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date
  //         }
  //       })
  //       setMovies(transformedMovies)
  //     });
  // }

const fetchMoviesHandler = useCallback(async()=> {
    setIsLoading(true);
    setError(null);
    try {
          const response = await fetch("https://http-request-api-5870c-default-rtdb.firebaseio.com/movies.json");
          if(!response.ok){
            throw new Error('Something went wrong!');
          }
    const data = await response.json();
    const loadedMovies = [];

    for (const key in data){
      loadedMovies.push({
        id: key,
        title: data[key].title,
        openingText: data[key].openingText,
        releaseDate: data[key].releaseDate
      })
    }


    setMovies(loadedMovies);
    }
    catch(error) {
      setError(error.message);
    }
    setIsLoading(false);
  },[]);

  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://http-request-api-5870c-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      body: JSON.stringify(movie),
      headers:{
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

  }


  return (
    <React.Fragment>
      <section>
        {/* <button onClick={fetchMoviesHandler}>Fetch Movies</button> */}
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        {!isLoading && movies.length >0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error &&<p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
