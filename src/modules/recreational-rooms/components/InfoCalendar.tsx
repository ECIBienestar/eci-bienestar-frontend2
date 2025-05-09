import Header from "./Header"
import Options from "./Options"
import RoomInfo from "./RoomInfo";
import { SlArrowLeftCircle } from "react-icons/sl";
import "../utils/RoomReservations.css"

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const hours = Array.from({ length: 10 }, (_, i) => {
    const hour = 10 + i;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : hour;
    return `${hour12}:00 ${suffix}`;
});

const infoRoom = {name: "Sala CREA juegos", 
    description: "En este espacio podras descansar y divertirte. Encontraras diferentes juegos y actividades.",
image:"./public/images/room-visual.png", 
games:[{name:"Astucia Naval", image:"./public/images/naval.png"}, {name:"Parques", image:"./public/images/parques.png"}, {name:"Tio Rico", image:"./public/images/tio-rico.png"}, {name:"Adivina Quien", image:"./public/images/whois.png"}], 
caractheristics: "Zona recreativa y de descanso con: Puffs grandes, perfectos para descansar Zona de pintura, crea y diviertete Juegos de mesa de todos los tipos"}

function InfoCalendar() {
    return <>
        <Header person="Estudiante" />
        <div className="main-container">
            <Options />
            <div className="general-information">
                <div className="reserve-header">
                    <SlArrowLeftCircle size={100} />
                    <div className="links">
                        <h4>Reservar</h4>
                        <h4>Mis Reservas</h4>
                    </div>
                </div>
                <div className="room-information">
                    <RoomInfo info={infoRoom} />
                </div>
                <div className="calenadar-space">
                    <table className="calendar-table">
                        <thead>
                            <tr>
                                <th>Hora</th>
                                {days.map(day => (
                                    <th key={day}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map(hour => (
                                <tr key={hour}>
                                    <td>{hour}</td>
                                    {days.map(day => (
                                        <td key={`${day}-${hour}`} className="calendar-cell"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button>Reservar</button>
            </div>

        </div>
    </>
}


export default InfoCalendar