import React from 'react'
import '../Cropinfo/page.css'

import { Link } from 'react-router-dom'
export default function Rice() {
    return (
        <div className='page'>
            <div className='Background'></div>
            <div className='box'>
                <div className='span'><Link to={"/"}>Back</Link></div>
                <h1>Rice</h1>
                <img src="https://t3.ftcdn.net/jpg/02/71/72/06/360_F_271720694_xeOnMuwr2oiP9PG7yn8cKet1upl76QOu.jpg" />
                <div className='info'>
                    {/* <div>Period: {v.Period}</div>
                                    <div>Weather: {v.Weather}</div>
                                    <div>Land: {v.Land}</div>
                                    <div>Location: {v.Location}</div>
                                    <div>Weather_Requirements:</div>
                                    <div>Temperature: {v.Weather_Requirements.Humidity.High_Humidity}</div>
                                    <div>{v.Weather_Requirements.Humidity.Avoiding_Drought}</div> */}
                    •	Period: June to November (Kharif season)<br />
                    •	Weather: Requires a warm, humid climate with rainfall between 1000-3000 mm.<br />
                    •	Land: Prefers well-drained loamy or clayey soils.<br />
                    •	Location: Konkan region, especially in Ratnagiri , Sindhudurg, Pune, Palghar and Raigad districts.
                    <br /><br />
                    Weather Requirements<br />
                    1.	Temperature:<br />
                    Optimal Range: Rice grows best in warm conditions, with an ideal temperature range of 25°C to 35°C during the growing season.<br />
                    Germination: Seeds require a minimum temperature of about 10°C for germination, but higher temperatures enhance growth.<br />
                    2.	Rainfall:<br />
                    Water Needs: Rice is a water-intensive crop that thrives in areas with abundant rainfall.<br />
                    Ideal Rainfall: An average annual rainfall of 1000 mm to 3000 mm is suitable. Monsoon rains provide the necessary moisture.<br />
                    Irrigation: In areas with less rainfall, supplementary irrigation is necessary, especially during dry spells.<br />
                    3.	Humidity:<br />
                    High Humidity: Rice prefers a humid environment, which helps in the growth of the plant and the filling of grains.<br />
                    Avoiding Drought: Prolonged dry conditions can adversely affect crop yield.<br />
                    4.	Soil Conditions:<br />
                    Soil Type: Well-drained loamy or clayey soils are ideal. Rice can also grow in flooded soils (paddy fields) but should have good drainage after the rainy season.<br />
                    Soil pH: A pH range of 5.5 to 7.0 is optimal.<br />
                    Growing Period<br />
                    1.	Kharif Season:<br />
                    Sowing Time: Typically planted between June and July, just before the onset of the monsoon.<br />
                    Germination: Seeds germinate within 7 to 10 days after planting, depending on soil moisture and temperature.<br />
                    Growth Stages: The crop goes through various stages, including seedling, tillering, flowering, and ripening.<br />
                    2.	Harvesting:<br />
                    Maturity: The crop is usually ready for harvest in October to November, approximately 120 to 150 days after sowing.<br />
                    Signs of Maturity: Harvesting occurs when the grains are hard and the leaves start turning yellow.<br />
                    3.	Post-Harvest:<br />
                    Drying: After harvesting, rice needs to be dried properly to reduce moisture content before storage to prevent spoilage.<br />


                </div>

            </div>
        </div >
    )
}
