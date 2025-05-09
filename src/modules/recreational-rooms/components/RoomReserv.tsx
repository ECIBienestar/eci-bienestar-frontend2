import { type reservation } from "../utils/types"

type props = {
    data: reservation;
}

function RoomReserv({data}:props){
    return <div className="reservation-card">
            <div className="info-reservation">
                <span>{data.room}</span>
                <span>{data.date}</span>
                <span>{data.elements}</span>
            </div>
            <div className="aditional-info">
                <span>{data.time}</span>
                <img src={data.image} alt="" />
            </div>
    </div>
}

export default RoomReserv