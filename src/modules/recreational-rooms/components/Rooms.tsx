import { type room } from "../utils/types"; 

type props = {
    data:room;
}


function Rooms({data}: props){
    return <div className="room-card">
        <div id="room-name">
            <h3>{data.name}</h3>
        </div>
        <img src={data.image} alt="room image" />
        <div id="room-description">
            <h3>{data.description}</h3>
        </div>
    </div>
}


export default Rooms