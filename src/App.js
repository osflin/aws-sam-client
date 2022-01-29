import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import Footer from './Footer'
import GridTable from './GridTable'

export default () => {
  const [message, setMessage] = useState()
  const [city, setCity] = useState('')
  const [stateOrProvince, setStateOrProvince] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [places, setPlaces] = useState()

  useEffect(() => {
    (async () => {
      console.log("calling server url :" + process.env.REACT_APP_API );
        const { data: { places } } = await axios.get(`${process.env.REACT_APP_API}`)
        setPlaces(places)
    })()
  }, [])

  function handleChange(e) {
    e.preventDefault()

    switch (e.target.name) {
      case 'city':
        setCity(e.target.value)
        break
      case 'stateOrProvince':
        setStateOrProvince(e.target.value)
        break
      case 'countryCode':
        setCountryCode(e.target.value)
        break
      default:
        break
    }
  }

  async function handleSubmit() {
    //alert("inside handle submit :");
    setMessage('Creating new place to visit ......')
    let currentPlaces = places

    // This is a bit of a hack as we wait for lambda to return the key
    currentPlaces.push({ placeKey: '0', city, stateOrProvince, countryCode })
    setCity('')
    setStateOrProvince('')
    setCountryCode('')
    setPlaces([])
    setPlaces(currentPlaces)

    const { data } = await axios.post(`${process.env.REACT_APP_API}create`, { city, stateOrProvince, countryCode })
    if (data.status === 'error') {
      // Re-hydrate the inputs to the user can attempt again
      setCity(currentPlaces.slice(-1)[0].city)
      setStateOrProvince(currentPlaces.slice(-1)[0].stateOrProvince)
      setCountryCode(currentPlaces.slice(-1)[0].countryCode)
      currentPlaces.pop()

      return setMessage(data.message)
    }

    if (data.status === 'success') {
      // Again, a bit of a hack as we wait for lambda to return the key
      currentPlaces.pop()
      currentPlaces.push({ placeKey: data.placeKey, city, stateOrProvince, countryCode })
      setPlaces([])
      setPlaces(currentPlaces)
      setMessage('Created new place to visit!')
    }
  }

  async function handleDelete(e) {
    setMessage('')

    // this is a fire-and-forget, unless we recieve an error back
    let currentPlaces = []
    places.map((place, i) => {
      if (place.placeKey !== e.placeKey) {
        currentPlaces.push(place)
      }
    })
    setPlaces([])
    setPlaces(currentPlaces)
    
    const { data } = await axios.post(`${process.env.REACT_APP_API}delete`, { placeKey: e.placeKey })
    // upon error, re-hydrate record
    if (data.status === 'error') {
      currentPlaces = places

      currentPlaces.push({
        placeKey: e.placeKey,
        picture: e.picture,
        city: e.city,
        stateOrProvince: e.stateOrProvince,
        countryCode: e.countryCode
      })
      setPlaces([])
      setPlaces(currentPlaces)
      
      return setMessage(data.message)
    }
  }

  return (   
    <div className="tc bg-light-gray">
      <Header/>
      <div className="cf">        
        <div className="fl w-100 w-20-ns bg-light-green ba br3 shadow-5">    
          <form className="pa2 black-80">
            <div className="red" style={{ height: '25px' }}>{message}</div>
            <div className="measure">
              <label  className="i f5 b db mb1">City:</label>
              <input id="city" className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={city} name="city" onChange={handleChange} /><br/>

              <label  className="i f5 b db mb1">State or Province:</label>
              <input className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={stateOrProvince} name="stateOrProvince" onChange={handleChange}/><br/>

              <label  className="i f5 b db mb1">Country Code:</label>
              <input className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={countryCode} name="countryCode" onChange={handleChange} /><br/>
              <button className="b ph3 pv2 input-reset ba b--black bg-lightest-blue grow pointer f6 dib br3"   type="button" onClick={() => handleSubmit()}>Submit</button>             
            </div>
          </form>
          <br/>        
        </div>
        <GridTable places={places} handleDelete={handleDelete}/>
      </div>
      <Footer />
    </div>
  )
}



