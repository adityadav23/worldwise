import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:9000'

function CitiesProvider({children}){
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setcurrentCity] = useState({});
  
    useEffect(function(){
      async function fetchCities(){
          try{
            setIsLoading(true)
            const res = await fetch(BASE_URL + "/cities");
            const data = await res.json();
            setCities(data);
        }catch(e){
          console.log(e.message)
        }finally{
          setIsLoading(false)
        }
      }
      fetchCities()
    },[])

    async function getCity(id){
        try{
          setIsLoading(true)
          console.log({id})
          const res = await fetch(BASE_URL + "/cities/"+id);
          const data = await res.json();
          setcurrentCity(data);
      }catch(e){
        console.log(e.message)
      }finally{
        setIsLoading(false)
      }
    }
    async function createCity(newCity) {
      // dispatch({ type: "loading" });
  
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data)
        setCities(cities=> [...cities,data])
        // dispatch({ type: "city/created", payload: data });
      } catch {
        alert("There was an error creating the city...")
        // dispatch({
        //   type: "rejected",
        //   payload: "There was an error creating the city...",
        // });
      }
    }
  
    async function deleteCity(id) {
      // dispatch({ type: "loading" });

      try {
        setIsLoading(true)
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        
        setCities(cities=> cities.filter(city=>city.id !== id))
        // dispatch({ type: "city/deleted", payload: id });
      } catch {
        // dispatch({
        //   type: "rejected",
        //   payload: "There was an error deleting the city...",
        // });
      }finally{
        setIsLoading(false)
      }
    }
  return <CitiesContext.Provider 
    value={{
    cities, 
    isLoading,
    getCity,
    currentCity,
    createCity,
    deleteCity,
    }}
  >
    {children}
  </CitiesContext.Provider>
}

function useCities(){
    const context =  useContext(CitiesContext);
    return context;
}

export {useCities, CitiesProvider}