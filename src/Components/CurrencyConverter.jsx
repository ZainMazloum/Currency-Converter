import React, { useEffect, useState } from 'react'
import DropDown from './DropDown';
import { RiArrowLeftRightFill } from "react-icons/ri";
// https://api.frankfurter.dev/v1/currencies
// https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
export const CurrencyConverter = () => {
    const [currencies , setCurrencies] = useState([])
    const [amount , setAmount] = useState(1);
    const [fromCurrency , setFromCurrency] = useState("USD")
    const [toCurrency , setToCurrency] = useState("INR")
    const [convertedAmount , setConvertedAmount] = useState(null)
    const [converting , setConverting] = useState(false)
    const [favorites , setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || ["USD"])
const fetchCurrencies = async () => {
    try{
        const res = await fetch("https://api.frankfurter.dev/v1/currencies")
        const data = await res.json();
          setCurrencies(Object.keys(data));
    }
  catch(error){
    console.error("Error Fetching" , error)
  }
}
useEffect(() => {
    fetchCurrencies();
},[])
console.log(currencies)
async function convertCurrency(){
    if(!amount) return;
    setConverting(true)
    try{
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
        const data = await res.json();
          setConvertedAmount(data.rates[toCurrency] + " " + toCurrency)
    }
      catch(error){
    console.error("Error Fetching" , error)
  }
  finally{
    setConverting(false)
  }
}
function handleFavorite(currency){
let updatedFavorites = [...favorites]
if(favorites.includes(currency)){
    updatedFavorites = updatedFavorites.filter((fav) => fav !== currency)
}
else{
    updatedFavorites.push(currency)
}
setFavorites(updatedFavorites)
localStorage.setItem("favorites",JSON.stringify(updatedFavorites))
}
function swapCurrencies(){
setToCurrency(fromCurrency)
setFromCurrency(toCurrency)
}
  return (
    <div className='max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md' >
      <h2 className='mb-5 text-2xl font-semibold text-gray-700'>CurrencyConverter</h2>  
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
        <DropDown currencies={currencies} title='From:' handleFavorite = {handleFavorite} currency={fromCurrency} setCurrency={setFromCurrency} favorites = {favorites}/>
        <div className=' flex justify-center -mb-5 sm:mb-0'>
            <button onClick={swapCurrencies} className='cursor-pointer p-2 bg-gray-200 rounded-full hover:bg-gray-300'>
                <RiArrowLeftRightFill className='text-xl text-gray-700'/>
            </button>
        </div>
        <DropDown currencies={currencies} title='To:' handleFavorite = {handleFavorite} currency={toCurrency} setCurrency={setToCurrency} favorites = {favorites}/>
        </div>
      <div className='mt-4'>
        <label htmlFor="amount" className='block text-sm font-medium text-gray-700'>amount:</label>
        <input type="number"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' />

      </div>
      <div className='flex justify-end mt-6'>
<button
  onClick={convertCurrency}
  className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${converting ? "animate-pulse" : ""}`}
>
  Convert
</button>
      </div>
{ convertedAmount && <div className='mt-4 text-lg font-medium text-right text-green-600'>
        {convertedAmount}
      </div>}
    </div>
  )
}
