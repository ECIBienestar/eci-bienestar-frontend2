import Header from "./Header"
import Options from "./Options"
import { SlArrowLeftCircle } from "react-icons/sl";
import ElementsCard from "./ElementsCard";
import { LuCalendar } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa6";
import "../utils/RoomReservations.css"

const possibleRes = {room: "Sala Crea Juegos", date:"Viernes, 9 de Mayo", time:"2:30 - 3:30", elementsResume:"2 elementos reservados",elements:[{name:"Astucia Naval", image:"./public/images/naval.png"}, {name:"Parques", image:"./public/images/parques.png"},{name:"Tio Rico", image:"./public/images/tio-rico.png"},{name:"Adivina Quien", image:"./public/images/whois.png"}], image:"./public/images/room-visual.png"}

function NewReservation(){
    return <>
        <Header person="Estudiante" />
        <div className="main-container">
            <Options/>
            <div className="display-container">
                <div className="parcial-header">
                    <SlArrowLeftCircle size={100}/>
                    <h1 id="text-newReserv">Nueva Reserva</h1>
                </div>
                <div className="display-info">
                    <div className="date-reservation">
                        <h4>Fecha de Reserva:</h4>
                        <span> {possibleRes.date} <LuCalendar /></span>
                    </div>
                    <div className="hours-time">
                        <h4>Horario:</h4>
                        <span> {possibleRes.time} <FaChevronDown /></span>
                    </div>
                </div>
                <div className="selected-room">
                    <h4>Sala:</h4>
                    <span>{possibleRes.room} <FaChevronDown /></span>
                </div> 
                <div className="selector-items">
                    <h4>Elementos Recreativos:</h4>
                    <div className="games-options">
                        {
                            possibleRes.elements.map((game,index) => ( <div key={index} className="game-item">
                                <ElementsCard data={game} />
                                <input type="checkbox" id={`game-checkbox-${index}`} />
                            </div>))
                        }
                    </div>
                </div>
                <button>Confirmar Reserva</button>
            </div>
            
        </div>
    </>
}

export default NewReservation