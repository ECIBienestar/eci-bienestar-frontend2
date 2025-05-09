import Header from "./Header"
import Options from "./Options"
import "../utils/RoomReservations.css"

function Confirmation(){
    return <>
        <Header person="Estudiante"/>
        <div className="main-container">
            <Options/>
        </div>
    </>
}

export default Confirmation