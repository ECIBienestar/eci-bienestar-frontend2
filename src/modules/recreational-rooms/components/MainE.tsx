import Header from "./Header"
import Options from "./Options"
import "../utils/RoomReservations.css"
import "../utils/RoomReservations.css"

function MainE(){
    return <>
        <Header person="Estudiante"/>
        <div className="main-container">
            <Options />
            <div className="info-container">
                <div className="welcome-image">
                <img src="./public/images/room-visual.png" alt="visual-room" />
                <div id="overload-text"> Bienvenidos al servicio de reservas de salas</div>
                </div>
                <div className="actions-section">
                    <p>Este espacio permite a los miembros de la comiunidad reservar salas de descanso y acceder al prestamo de elementos que hacen parte de las salas. También pueden consultar o cancelar las reservas realizadas.</p>
                    <div id="buttons">
                        <button id="reservar">Reservar</button>
                        <button>Mis Reservas</button>
                    </div>
                </div>
                
                
            </div>
        </div>
        
    </>
}

export default MainE