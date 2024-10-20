import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

const App = () => {
  const [data, setdata] = useState([]);
  const [error, setError] = useState(false);
  const [input, setinput] = useState("");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setProgress(10);
        setError(false);
        const res = await axios.get(
          `https://dummyjson.com/recipes/search?q=${query}`
        );
        setdata(res.data.recipes || []);
        setProgress(100);
      } catch (error) {
        setError(true);
        setProgress(100);
      }
    })();
  }, [query]);

  console.log(data);

  const handleInput = (e) => {
    setinput(e.target.value);
  };
  const handleSubmit = () => {
    if (input.trim()) {
      setQuery(input);
      setinput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="w-full h-auto">
        <LoadingBar
          color="red"
          height={5}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold tracking-wider p-10">
            Recipes
          </h1>
          <h2 className="text-xl font-medium">
            Total Recipes: {data.length || 0}
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border-4 m-5"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>

        {error && (
          <div className="text-red-500 font-semibold text-4xl text-center">
            Something went wrong
          </div>
        )}

        {!error && data.length === 0 && query && (
          <div className="text-4xl text-gray-500 text-center font-semibold m-5">
            No recipes found for "{query}"
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-10 m-10">
          {!error &&
            data.map(({ id, image, name, ingredients }) => {
              return (
                <div
                  key={id}
                  className="w-60 h-auto rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all ease-in hover:scale-105"
                >
                  <img
                    src={image}
                    alt="recipes_image"
                    className="w-48 rounded-lg m-2"
                  />
                  <h1 className="text-2xl font-bold">{name}</h1>
                  <p className="font-semibold">
                    Ingredient:
                    {ingredients.map((item) => {
                      return <li className="text-sm font-normal">{item}</li>;
                    })}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default App;
