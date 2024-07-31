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
  return <CitiesContext.Provider 
    value={{
    cities, 
    isLoading,
    getCity,
    currentCity,
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