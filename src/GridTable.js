import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const GridTable = ({places, handleDelete}) => {
  return (
    <div>
        <div className="fl w-100 w-80-ns bg-washed-blue tc ba br3 shadow-5" style={{ overflowY: 'scroll', height: '500px'}}>
            <table class="f6 w-100 mw8 left" cellspacing="0">
                <thead>
                <tr class=" bg-light-green">
                    <th class="fw5 tc pa3 ">City</th>
                    <th class="fw6 tc pa3 ">State</th>
                    <th class="fw6 tc pa3 ">Country</th>
                    <th class="fw6 tc pa3 ">Image</th>
                    <th class="fw6 tc pa3 "></th>
                    <th class="fw6 tc pa3 "></th>
                </tr>
                </thead>
            { places && places.length === 0 && <div>No places found</div>}
            { places && places.map((place) => {  
                return <tbody class="lh-copy">
                    <tr class="">
                        <td class="pa3">{place.city}</td>
                        <td class="pa3">{place.stateOrProvince} </td>
                        <td class="pa3">{place.countryCode}</td>
                        <td class="pa3"><Link to={`/place/${place.placeKey}`}><img src={`${process.env.REACT_APP_PICTURE_URL + place.picture}`} alt="Update" style={{ maxHeight: "125px", maxWidth: "125px"}} /></Link> </td>
                        <td class="pa3"><Link className="link b black hover-orange" to={`/place/${place.placeKey}`}>update</Link></td>
                        <td class="pa3"><a href="#" className={"link b black hover-dark-red"} onClick={() => handleDelete(place)} style={{ fontSize: ".8rem" }}>Delete</a></td>
                    </tr>            
                    </tbody>
                })
            }    
            </table>
        </div>
    </div>
  );
}

export default GridTable;
