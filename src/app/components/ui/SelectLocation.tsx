
import { useEffect, useState } from "react"
import axios from "axios"

interface Location 
{
  _id: string
  country_name: string
  states: 
  {
    state_name: string
    cities: 
    { 
      city_name: string 
    }[]
  }[]
}

interface LocationSelectorProps 
{
  onLocationChange: (country: string, state: string, city: string) => void
  locationError: boolean
}

export default function LocationSelector({ onLocationChange, locationError}: LocationSelectorProps) 
{
  const [countries, setCountries] = useState<Location[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [states, setStates] = useState<Location["states"]>([])
  const [cities, setCities] = useState<Location["states"][0]["cities"]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false)

  const loadCountries = async () => 
  {
    setLoading(true)
    try 
    {
      const { data } = await axios.get("/api/locations")
      if (data.locations) 
      {
        setCountries(data.locations)
      } 
      else 
      {
        setCountries([])
      }
    } 
    catch { setCountries([]) } 
    finally{ setLoading(false) }
  }

  useEffect(() => 
  {
    if (selectedCountry) 
    {
      const country = countries.find((c) => c._id === selectedCountry)
      setStates(country?.states || [])
      setSelectedState("")
      setCities([])
      setSelectedCity("")
    }
  }, [selectedCountry, countries])

  useEffect(() => 
  {
    if (selectedState) 
    {
      const state = states.find((s) => s.state_name === selectedState)
      setCities(state?.cities || [])
      setSelectedCity("")
    }
  }, [selectedState, states])

  useEffect(() => 
  {
    if (selectedCountry || selectedState || selectedCity) 
    {
      
      const country = countries.find((c) => c._id === selectedCountry) /* Get country name by country ID */
      onLocationChange(country?.country_name || "", selectedState, selectedCity)  /* Sending data to the parent component */
    }
  }, [selectedCountry, selectedState, selectedCity, onLocationChange, countries])

  return (
    <div className="flex flex-col gap-4 text-placeholder">

      {/* Country Select */}
      <div className="relative ">

        <label className="block text-gradient font-serif">Country</label>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          onBlur={() => setIsCountryOpen(false)}
          onFocus={() => 
          {
            setIsCountryOpen(true)
            if (countries.length === 0) 
            {
              loadCountries()
            }
          }}
          className=
          {
            `w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
            ${locationError && !selectedCountry ? 'border-red-500' : 'border-gray-300'}`
          }
        >

        <option value="" disabled hidden>Select a country</option>
        {isCountryOpen && loading ? (
          <option disabled>Loading...</option>
        ) : (
          countries.map((country) => (
            <option className="font-serif" key={country._id} value={country._id}>
              {country.country_name}
            </option>
          ))
        )}
        </select>
        {locationError && !selectedCountry && (
          <p className=" text-red-500 text-sm">Country is required.</p>
        )}
      </div>

      {/* State Select */}
      {states.length > 0 && (
        <div className="relative">
          <label className="block text-gradient font-serif">State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                ${locationError && !selectedState ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="" disabled hidden>Select a state</option>
            {states.map((state) => (
              <option key={state.state_name} value={state.state_name} className="font-serif">
                {state.state_name}
              </option>
            ))}
          </select>
          {locationError && !selectedState && (
            <p className=" text-red-500 text-sm">State is required.</p>
          )}
        </div>
      )}

      {/* City Select */}
      {cities.length > 0 && (
        <div className="relative">
          <label className="block text-gradient font-serif">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                ${locationError && !selectedCity ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="" disabled hidden>Select a city</option>
            {cities.map((city) => (
              <option className="font-serif" key={city.city_name} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
          {locationError && !selectedCity && (
            <p className=" text-red-500 text-sm">City is required.</p>
          )}
        </div>
      )}
    </div>
  )
}


