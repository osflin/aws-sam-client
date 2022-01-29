import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './Header'
import Footer from './Footer'
import GridTable from './GridTable'

export default (props) => {
  const [message, setMessage] = useState('')
  const [city, setCity] = useState('')
  const [stateOrProvince, setStateOrProvince] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [picture, setPicture] = useState('')
  const [updateButton, setUpdateButton] = useState('Submit')
  const [places, setPlaces] = useState()

  useEffect(() => {
    (async () => {
      console.log("calling server url :" + process.env.REACT_APP_API );
        const { data: { places } } = await axios.get(`${process.env.REACT_APP_API}`)
        setPlaces(places)
    })()
  }, [])

  useEffect(() => {
    if (typeof props.match.params.id !== 'undefined') {
      (async () => {
        const { data : { place } } = await axios.get(`${process.env.REACT_APP_API}place/${props.match.params.id}`)
        if (place) {
          setUpdateButton('Update')

          if (place.picture) setPicture(place.picture)
          if (place.city) setCity(place.city)
          if (place.stateOrProvince) setStateOrProvince(place.stateOrProvince)
          if (place.countryCode) setCountryCode(place.countryCode)
        }
      })()
    }
  }, [props.match.params.id])

  async function upload(e) {
    const file = e.target.files[0]

    const { data } = await axios.post(`${process.env.REACT_APP_API}signed-url`, { fileName: file.name })
    const { picture, signedUrl } = data

    await axios.put(`${signedUrl}`, file, { headers: { 'Content-Type': '*/*' } })
    await axios.post(`${process.env.REACT_APP_API}save-picture`, {
      placeKey: props.match.params.id,
      picture
    })
    setPicture(picture)
  }

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

  function deletePicture() {
    axios.post(`${process.env.REACT_APP_API}delete-picture`, { placeKey: props.match.params.id, picture })
    setPicture('')
  }

  async function handleSubmit() {
    setMessage('')
    const { data } = await axios.post(`${process.env.REACT_APP_API}update`, { placeKey: props.match.params.id, city, stateOrProvince, countryCode })
    if (data.status === 'error') return setMessage(data.message)
    if (data.status === 'success') return props.history.push('/')
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

  if (!city) return <div>Loading...</div>

  return (
    <div className="tc bg-light-gray">
      <Header/>
      <div className="cf"> 
        <div className="fl w-100 w-20-ns bg-light-green ba br3 shadow-5" style={{ padding: '15px'}}>
          <form onSubmit={() => handleSubmit()}>
            {(picture && (
              <div>
                <img src={`${process.env.REACT_APP_PICTURE_URL + picture}`} style={{ maxHeight: "300px", maxWidth: "300px" }} /><br/>
                <span onClick={() => deletePicture() } style={{ fontSize: ".85rem" }}>Delete Picture</span>
              </div>
            ))}
            {(!picture && <input type="file" onChange={(e) => upload(e)} />)}

            <div style={{ height: '15px' }}>{message}</div>        
            <div className="measure">
                  <label for="city" className="i f5 b db mb1">City:</label>
                  <input id="city" className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={city} name="city" onChange={handleChange} /><br/>

                  <label for="city" className="i f5 b db mb1">State or Province:</label>
                  <input className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={stateOrProvince} name="stateOrProvince" onChange={handleChange}/><br/>

                  <label for="city" className="i f5 b db mb1">Country Code:</label>
                  <input className="ba b--black-20 pa2 mb2 db w-100 hover-bg-lightest-blue" type="text" value={countryCode} name="countryCode" onChange={handleChange} /><br/>
                  <button class="b ph3 pv2 input-reset ba b--black bg-lightest-blue grow pointer f6 dib br3"   type="button" onClick={() => handleSubmit()}>{updateButton}</button>             
                </div>
          </form>
        </div>
        <GridTable places={places} handleDelete={handleDelete}/>
      </div>
      <Footer />
    </div>
  )
}



