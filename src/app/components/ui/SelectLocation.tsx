"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Location {
  _id: string;
  country_name: string;
  states: {
    state_name: string;
    cities: { city_name: string }[]; // Nome das cidades dentro de cada estado
  }[];
}

interface LocationSelectorProps {
    onLocationChange: (country: string, state: string, city: string) => void;
  }
  
  export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
    const [countries, setCountries] = useState<Location[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedState, setSelectedState] = useState<string>("");
    const [states, setStates] = useState<Location["states"]>([]);
    const [cities, setCities] = useState<Location["states"][0]["cities"]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/locations");
        if (Array.isArray(data.locations)) {
          setCountries(data.locations);
        } else {
          setCountries([]);
        }
      } catch {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (selectedCountry) {
        const country = countries.find((c) => c._id === selectedCountry);
        setStates(country?.states || []);
        setSelectedState("");
        setCities([]);
        setSelectedCity("");
      }
    }, [selectedCountry, countries]);
  
    useEffect(() => {
      if (selectedState) {
        const state = states.find((s) => s.state_name === selectedState);
        setCities(state?.cities || []);
        setSelectedCity("");
      }
    }, [selectedState, states]);
  
    // Chamar a função onLocationChange para enviar os dados separados
    useEffect(() => {
      if (selectedCountry && selectedState && selectedCity) {
        // Enviar o country_name ao invés do country ID
        const country = countries.find((c) => c._id === selectedCountry);
        onLocationChange(country?.country_name || "", selectedState, selectedCity);  // Passando o nome do país
      }
    }, [selectedCountry, selectedState, selectedCity, onLocationChange, countries]);
  
    return (
      <div className="flex flex-col gap-4">
        {/* Country Select */}
        <div className="relative ">
          <label className="block text-gradient font-serif">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            onFocus={() => {
              setIsCountryOpen(true);
              if (countries.length === 0) {
                fetchCountries();
              }
            }}
            onBlur={() => setIsCountryOpen(false)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a country</option>
            {isCountryOpen && loading ? (
              <option disabled>Loading...</option>
            ) : (
              countries.map((country) => (
                <option className="bg-indigo-400 font-serif" key={country._id} value={country._id}>
                  {country.country_name}
                </option>
              ))
            )}
          </select>
        </div>
  
        {/* State Select */}
        {states.length > 0 && (
          <div className="relative">
            <label className="block text-gradient font-serif">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.state_name} value={state.state_name} className="bg-indigo-400 font-serif">
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>
        )}
  
        {/* City Select */}
        {cities.length > 0 && (
          <div className="relative">
            <label className="block text-gradient font-serif">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option className="bg-indigo-400 font-serif" key={city.city_name} value={city.city_name}>
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }
  
  
