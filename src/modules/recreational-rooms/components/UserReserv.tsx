import Header from "./Header"
import Options from "./Options"
import { SlArrowLeftCircle } from "react-icons/sl";
import RoomReserv from "./RoomReserv"

const reservByUser = [{room: "Sala Crea Juegos", date:"Viernes, 9 de Mayo", time:"2:30 - 3:30", elements:"2 elementos reservados", image:"./public/images/room-visual.png"},
    {room: "Sala Crea Arte", date:"Martes, 13 de Mayo", time:"12:00 - 1:30", elements:"1 elemento reservados", image:"./public/images/room-visual.png"}]

function UserReserv(){
    return <>
        <Header person="Estudiante"/>
        <div className="main-container">
            <Options />
            <div className="user-reservations">
                <div className="options-reservations-panel">
                    <SlArrowLeftCircle size={100}/>
                    <h2>Mis Reservas</h2>
                    <div className="links">
                        <h4>Reservar</h4>
                        <h4>Mis Reservas</h4>
                    </div>
                </div>
                <div id="reservations">
                    {
                        reservByUser.map(reserv => (<RoomReserv data={reserv}/>))
                    }
                </div>
            </div>
        </div>
    </>
}

export default UserReserv