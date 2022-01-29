import React from 'react';
import { Link } from 'react-router-dom';

const Grid = ({places, handleDelete}) => {
  return (
    <div className="fl w-100 w-80-ns bg-washed-blue tc ba br3 shadow-5" style={{ overflowY: 'scroll', height: '500px'}}>
        { places && places.length === 0 && <div>No places found</div>}
        { places && places.map((place) => {
            if (place.placeKey === "0") return <div key={Math.random()} style={{ marginBottom: "15px"}}>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</div>
            if (place.picture) return <div key={place.placeKey} style={{ marginBottom: "15px"}}><Link to={`/place/${place.placeKey}`}><img src={`${process.env.REACT_APP_PICTURE_URL + place.picture}`} style={{ maxHeight: "125px", maxWidth: "125px"}} /><br/>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</Link> <a className={"link b black hover-dark-red"} style={{ fontSize: ".8rem" }} onClick={() => handleDelete(place)}>Delete</a></div>

            return <div key={place.placeKey} style={{ marginBottom: "15px"}}><Link className="link b blue hover-orange" to={`/place/${place.placeKey}`}>{`${place.city}, ${place.stateOrProvince} ${place.countryCode}`}</Link><span className="f6" > | </span><a className={"link b black hover-dark-red"} onClick={() => handleDelete(place)} style={{ fontSize: ".8rem" }}>Delete</a></div>
        })
        }
    </div>
  );
}

export default Grid;
