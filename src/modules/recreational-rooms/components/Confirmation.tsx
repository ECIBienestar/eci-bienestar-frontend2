import Header from "./Header"
import Options from "./Options"
import "../utils/RoomReservations.css"
import { BsCheck2Circle } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";

const reservation = {room: "Sala Crea Juegos", date:"Viernes, 9 de Mayo", time:"2:30 - 3:30", elementsResume:"2 elementos reservados",elements:[{name:"Astucia Naval", image:"./public/images/naval.png"}, {name:"Parques", image:"./public/images/parques.png"}], image:"./public/images/room-visual.png"}

function Confirmation(){
    return <>
        <Header person="Estudiante"/>
        <div className="main-container">
            <Options />
            <div className="card-confirmation">
                <div className="header-card">
                    <BsCheck2Circle size={90}/>
                    <h2>¡Reserva Confirmada!</h2>
                </div>
                <div className="card-content">
                    <div className="reservated-room">
                        <span>Sala</span>
                        <h3>{reservation.room}</h3>
                    </div>
                    <div className="reservated-time">
                        <span>Horario</span>
                        <h3>{reservation.time}</h3>
                    </div>
                    <div className="reeservated-date">
                        <span>Fecha</span>
                        <h3>{reservation.date}</h3>
                    </div>
                    <button> <IoMdArrowRoundBack size={30}/>Volver a Inicio</button>
                </div>
            </div>
        </div>
    </>
}

export default Confirmation