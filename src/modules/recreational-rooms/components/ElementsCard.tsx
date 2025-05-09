import { type Game } from "../utils/types"
import "../utils/RoomReservations.css"

type props={
    data:Game
}

function ElementsCard({data}:props){
    return <div className="game-card">
        <img src={data.image} alt="" />
        <h4>{data.name}</h4>
    </div>
}

export default ElementsCard