import Header from "./Header"
import Options from "./Options"
import { SlArrowLeftCircle } from "react-icons/sl";
import ElementsCard from "./ElementsCard";
import "../utils/RoomReservations.css"

const reservation = {room: "Sala Crea Juegos", date:"Viernes, 9 de Mayo", time:"2:30 - 3:30", elementsResume:"2 elementos reservados",elements:[{name:"Astucia Naval", image:"./public/images/naval.png"}, {name:"Parques", image:"./public/images/parques.png"}], image:"./public/images/room-visual.png"}

function InfoReserv(){
    return <>
        <Header person="Estudiante" />
        <div className="main-container">
            <Options/>
            <div className="display-container">
                <div className="parcial-header">
                    <SlArrowLeftCircle size={100}/>
                    <h1>Tu Reserva</h1>
                </div>
                <div className="display-info">
                    <div className="date-reservation">
                        <h4>Fecha de Reserva:</h4>
                        <span> {reservation.date}</span>
                    </div>
                    <div className="hours-time">
                        <h4>Horario:</h4>
                        <span> {reservation.time}</span>
                    </div>
                </div>
                <div className="selected-room">
                    <h4>Sala:</h4>
                    <span>{reservation.room}</span>
                </div> 
                <div className="selector-items">
                    <h4>Elementos Recreativos:</h4>
                    <div className="games-options">
                        {
                            reservation.elements.map(game => (<ElementsCard data={game}/>))
                        }
                    </div>
                </div>
            </div>
            
        </div>
    </>
}

export default InfoReserv