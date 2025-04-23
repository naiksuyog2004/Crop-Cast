import React from 'react'
import '../Cropinfo/page.css'

import { Link } from 'react-router-dom'
export default function Rice() {
    return (
        <div className='page'>
            <div className='Background'></div>
            <div className='box'>
                <div className='span'><Link to={"/"}>Back</Link></div>
                <h1>Sugarcane</h1>
                <img src="https://plantix.net/en/library/assets/custom/crop-images/sugarcane.jpeg" />
                <div className='info'>
                    {/* <div>Period: {v.Period}</div>
                                    <div>Weather: {v.Weather}</div>
                                    <div>Land: {v.Land}</div>
                                    <div>Location: {v.Location}</div>
                                    <div>Weather_Requirements:</div>
                                    <div>Temperature: {v.Weather_Requirements.Humidity.High_Humidity}</div>
                                    <div>{v.Weather_Requirements.Humidity.Avoiding_Drought}</div> */}
                    •	Period: Planting can occur in both Kharif (June) and Rabi (February) seasons; harvested 12-18 months later.<br />
                    •	Weather: Requires hot and humid conditions with ample rainfall (1000-1500 mm).<br />
                    •	Land: Deep, well-drained alluvial or loamy soil.<br />
                    •	Location: Kolhapur, Sangli, and Solapur.
                    <br /><br />
                    Weather Requirements<br />
                    1.	Temperature:<br />
                    Optimal Range: Sugarcane thrives in warm temperatures, with an ideal range of 20°C to 30°C.<br />
                    Growth Sensitivity: Temperatures above 30°C can promote rapid growth, but extreme heat can stress the plants, especially during critical growth stages.<br />
                    2.	Rainfall:<br />
                    Water Needs: Sugarcane is a water-intensive crop, requiring substantial moisture throughout its growing period.<br />
                    Ideal Rainfall: An average rainfall of 1000 mm to 1500 mm is ideal. Well-distributed rainfall is crucial, especially during the growth and ripening stages.<br />
                    Irrigation: In areas with less rainfall or during dry spells, supplementary irrigation is essential, particularly for water stress management.<br />
                    3.	Humidity:<br />
                    High Humidity: Sugarcane prefers high humidity, which aids in growth and the development of sucrose in the stems.<br />
                    4.	Soil Conditions:<br />
                    Soil Type: Deep, well-drained alluvial or loamy soils are ideal. Sugarcane can also tolerate heavy clay soils if they are well-drained.<br />
                    Soil pH: A pH range of 6.0 to 8.0 is suitable for optimal growth.<br />
                    Growing Period<br />
                    1.	Planting Time:<br />
                    Kharif Season: Sugarcane is commonly planted during the Kharif season (June to July) after the onset of the monsoon.<br />
                    Rabi Season: In some regions, planting can also occur in the Rabi season (February to March).<br />
                    2.	Germination:<br />
                    Duration: Seeds (setts) generally take about 10 to 15 days to germinate, depending on soil temperature and moisture levels.<br />
                    3.	Growth Stages:<br />
                    Early Growth: The initial growth period lasts for about 3-4 months, during which the plant establishes its root system and develops shoots.<br />
                    Tillering: Occurs around 3-6 months after planting, where additional shoots form, increasing the potential yield.<br />
                    Grand Growth: The grand growth phase occurs during the rainy season, typically from July to September, when the plant height and biomass increase significantly.<br />
                    4.	Ripening:<br />
                    Maturity: Sugarcane typically matures in about 12 to 18 months after planting. The exact time depends on the variety and environmental conditions.<br />
                    Signs of Maturity: Harvesting occurs when the leaves start to dry, and the cane has reached optimal sugar content.<br />
                    5.	Harvesting:<br />
                    Timeframe: Harvesting usually takes place from October to March, depending on the planting time and climatic conditions.<br />
                    Post-Harvest: After cutting, the canes are often processed quickly to extract sugar, as the sucrose content begins to decline after harvesting.<br />

                </div>

            </div>
        </div >
    )
}
