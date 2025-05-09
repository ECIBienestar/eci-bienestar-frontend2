import { BsThreeDots } from "react-icons/bs";
import "../utils/RoomReservations.css"

function Options(){
    return <div className="options-container">
    <img src="./public/images/calendar.png" alt="turnos" />
    <h3>Turnos Bienestar</h3>
    <img src="./public/images/group.png" alt="salas" />
    <h3>Salas recreacion</h3>
    <img src="./public/images/classes.png" alt="clases" />
    <h3>Clases Extra</h3>
    <img src="./public/images/ball.png" alt="prestamos" />
    <h3>Prestamos Deportivos</h3>
    <img src="./public/images/gym.png" alt="" />
    <h3>Seguimiento deportivo</h3>
    <BsThreeDots size={80} id="options-botton"/>
</div>
} 

export default Options