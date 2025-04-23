import React from 'react'
import '../Cropinfo/page.css'
import { Link } from 'react-router-dom'
export default function Rice() {
    return (
        <div className='page'>
            <div className='Background'></div>
            <div className='box'>
                <div className='span'><Link to={"/"}>Back</Link></div>
                <h1>Wheat</h1>
                <img src="https://fyllo.in/_next/static/media/rice.31d268ee.png" />
                <div className='info'>
                    {/* <div>Period: {v.Period}</div>
                                    <div>Weather: {v.Weather}</div>
                                    <div>Land: {v.Land}</div>
                                    <div>Location: {v.Location}</div>
                                    <div>Weather_Requirements:</div>
                                    <div>Temperature: {v.Weather_Requirements.Humidity.High_Humidity}</div>
                                    <div>{v.Weather_Requirements.Humidity.Avoiding_Drought}</div> */}
                    •	Period: November to April (Rabi season)<br />
                    •	Weather: Thrives in cool, dry weather; needs around 500-800 mm of rainfall.<br />
                    •	Land: Grows well in clayey and loamy soils.<br />
                    •	Location: Nashik, Ahmednagar, and some parts of Pune.
                    <br /><br />
                    Weather Requirements<br />
                    1.	Temperature:<br />
                    Optimal Range: Wheat grows best in cooler climates, with ideal temperatures ranging from 10°C to 25°C during the growing season.<br />
                    Germination: A minimum temperature of about 3°C to 5°C is necessary for seed germination, but higher temperatures (around 20°C) favor faster growth.<br />
                    2.	Rainfall:<br />
                    Water Needs: Wheat requires moderate rainfall, particularly during the growing and flowering stages.<br />
                    Ideal Rainfall: Approximately 500 mm to 800 mm of rainfall is suitable, with most of it occurring during the Rabi season.<br />
                    Irrigation: In regions with insufficient rainfall, irrigation is crucial, especially during the critical stages of tillering and grain filling.<br />
                    3.	Humidity:<br />
                    Moderate Humidity: Wheat prefers moderate humidity levels. High humidity during the grain-filling period can lead to disease and reduce quality.<br />
                    4.	Soil Conditions:<br />
                    Soil Type: Well-drained, loamy, or clayey soils are ideal for wheat cultivation.<br />
                    Soil pH: A pH range of 6.0 to 7.5 is preferred for optimal growth.<br />
                    Growing Period<br />
                    1.	Rabi Season:<br />
                    Sowing Time: Wheat is typically sown from November to December, after the monsoon season has ended.<br />
                    Germination: Seeds germinate within 7 to 10 days under optimal conditions.<br />
                    2.	Growth Stages:<br />
                    Seedling Stage: Establishment of seedlings occurs in December.<br />
                    Tillering Stage: This stage happens around January to February, where the plant develops additional shoots.<br />
                    Flowering Stage: Wheat flowers from February to March, a critical period for grain development.<br />
                    3.	Harvesting:<br />
                    Maturity: The crop is usually ready for harvest by April to May, about 120 to 150 days after sowing.<br />
                    Signs of Maturity: Harvesting occurs when the grains are hard, and the plants begin to turn golden yellow.<br />
                    4.	Post-Harvest:<br />
                    Drying: After harvesting, wheat needs to be properly dried to reduce moisture content and ensure quality storage.<br />



                </div>

            </div>
        </div >
    )
}
