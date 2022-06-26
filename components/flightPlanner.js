import ResultSummary from '../components/resultSummary';
import styles from './css-modules/flightPlanner.module.css'

import { useEffect, useState } from 'react'

export default function Home() {
    

    
    const getFlight = async (event) => {
        event.preventDefault();
        const loadingWheel = document.getElementById("loading");
        const searchForm = document.getElementsByTagName("fieldset");
        disableFormInput(loadingWheel, searchForm);
        document.getElementById("errormessage").style = {display: "block"}
        
       
        const res = await fetch('/api/getFlights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                departure: event.target.departure.value,
                destination: event.target.holidayType.value,
                month: event.target.month.value,
                days: event.target.days.value,
                budget: event.target.budget.value,
                class: event.target.class.value,
                people: event.target.people.value,
            }),
            
        });
        const result = await res.json();
        if (result.error) {
            throwError(result.error);
        } else {
            enableFormInput(loadingWheel, searchForm);
            if (result.data[0]) {
                // call function to format the data
               setFlightData(await formatData(result.data));
               
            }
            else {
                noFlight();
            }
        }
    }

    function disableFormInput(loadingWheel, searchForm) {
        loadingWheel.style.visibility = 'visible';
        searchForm[0].setAttribute("disabled", "true")
    }

    function enableFormInput(loadingWheel, searchForm) {
        loadingWheel.style.visibility = 'hidden';
        searchForm[0].removeAttribute("disabled")
    }
    const [flightData, setFlightData] = useState([{flyFromAirport: '', flyToAirport: '', flyFromCity: '', flyToCity: '', dateOut: '', dateBack: '', price: '', airline: '', bookingLink: ''}]);

    async function getAirlineName(code) {
        const res =  await fetch('/api/getAirlineCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code
            }),
            
        });
        
        const result = await res.json();
        if (result.errors) {
            return "Data Not Found"
            
        } else {
            return result.data[0].commonName;
        }       
    }

    async function formatData(data) {
        let datum;
        let formattedData = [];
        for (let i = 0; i < data.length; i++) {
            let formattedDatum = {flyFromAirport: '', flyToAirport: '', flyFromCity: '', flyToCity: '', dateOut: '', dateBack: '', price: '', airline: '', bookingLink: ''};
            datum = data[i];
            formattedDatum.flyFromAirport = datum.flyFrom;
            formattedDatum.flyToAirport = datum.flyTo;
            formattedDatum.flyFromCity = datum.cityFrom;
            formattedDatum.flyToCity = datum.cityTo;
            formattedDatum.dateOut = new Date(datum.route[0].local_departure).toLocaleString();
            formattedDatum.dateBack = new Date(datum.route[1].local_departure).toLocaleString();
            formattedDatum.price = datum.price;
            formattedDatum.airline = (await getAirlineName(datum.route[0].airline));
            formattedDatum.bookingLink = datum.deep_link;
            
            formattedData.push(formattedDatum);
        }
        return await formattedData;
    }



    /* If no flight is returned display an error message */
    function noFlight() {
        setFlightData([{flyFromAirport: '', flyToAirport: '', flyFromCity: '', flyToCity: '', dateOut: '', dateBack: '', price: '', airline: '', bookingLink: ''}])
        document.getElementById("errormessage").style = {display: ""}
    }

    /* current month incremented by 2 as javascript date counts month from 0
    and next month is needed.
    when month is 1 digit long (jan -> oct) a 0 is added to the start */
    function getNextMonthAndCurrentYear() {
        const month = String(new Date().getMonth()+2);
        const year = new Date().getFullYear();
        
        return year+"-"+month.padStart(2, '0')
    }

    function throwError(errorMessage) {
        document.getElementById("errormessage").innerHTML = errorMessage;
    }

    return (
        <section >

                <div className='row justify-content-between p-5 vh-100 vw-90'>
                    <div className='col-3 py-5 mt-5 h-75 form-group row text-light'>
                        
                        <fieldset>
                            <h1>Find Flights</h1>
                            <form onSubmit={getFlight}>
                                
                                <label>Departure Airport</label><input className="form-control" id="departure" name="departure" type="text" defaultValue="Edinburgh"></input>
                                                    
                                <label>Type of Holiday</label>
                                <select className="form-control" name="holidayType" id="holidayType">
                                    <option value="MAD">Relax on the Beach</option>
                                    <option value="CDG">Explore a City</option>
                                    <option value="GVA">Snowy Adventure</option>
                                    <option value="IBZ">Non-stop Party</option>
                                </select>
                            
                                <label>Month of Travel</label><input className="form-control" id="month" name="month" type="month" defaultValue="2022-07" min={`${getNextMonthAndCurrentYear()}`}></input>
                                <label>How Many Days</label><input className="form-control" id="days" name="days" type="number" defaultValue="7" min="1" max="28"></input>
                                <label>Budget</label><input className="form-control" id="budget" name="budget" type="number" defaultValue="750" min="25"></input>
            
                                <label>Cabin Class</label>
                                <select className="form-control" name="class" id="class">
                                    <option value="M">Economy</option>
                                    <option value="W">Premium Economy</option>
                                    <option value="C">Business</option>
                                    <option value="F">First</option>
                                </select>
                                
            
                                <label>How Many People</label><input className="form-control" id="people" name="people" type="number" defaultValue="2" min="1" max="9"></input>
            
                                <button className=" mt-3 btn btn-light" id="submit" type="submit">Submit</button>
            
                            </form>
                        </fieldset>
                    </div>

                    <div className='col-7 px-5 h-100 overflow-scroll'>
                        <h1>Results</h1>
                        <div style={{display: "none"}} className="alert alert-danger" id="errormessage">No Flights Available!</div>
                        {flightData.map((d) => (<ResultSummary dest={d.flyToCity} outgoing={d.dateOut} back={d.dateBack} price={d.price} airline={d.airline}/>))}
                        <div id="loading" className={styles.loading}></div>
                          
                    </div>
                    
                    
                </div>
                <div className='row'>

                </div>
                   

        </section>
        

    )
}