import { type room } from "../utils/types"
import ElementsCard from "./ElementsCard"
import "../utils/RoomReservations.css"

type props = {
    info: room;
}

function RoomInfo({info}: props){
    return <div className="room-info-board">
        <span>{info.name}</span>
        <div className="characteristics">
            <img src={info.image} alt="room-image" />
            <p>{info.caractheristics}</p>
        </div>
        <div className="games-options">
            {
                info.games?.map(game => (<ElementsCard data={game} />))
            }
        </div>
    </div>
}

export default RoomInfo