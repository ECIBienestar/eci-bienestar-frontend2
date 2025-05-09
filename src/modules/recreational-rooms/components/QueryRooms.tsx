import Header from "./Header"
import Options from "./Options"
import Rooms from "./Rooms"
import { SlArrowLeftCircle } from "react-icons/sl";

const listRooms = [{name: "Sala CREA juegos", 
    description: "En este espacio podras descansar y divertirte. Encontraras diferentes juegos y actividades.",
image:"./public/images/room-visual.png", 
games:[{name:"Astucia Naval", image:""}], 
caractheristics: "Zona recreativa y de descanso con: Puffs grandes, perfectos para descansar Zona de pintura, crea y diviertete Juegos de mesa de todos los tipos"}, {name: "Sala CREA arte", 
    description: "En este espacio podras descansar y divertirte. Encontraras diferentes juegos y actividades.",
image:"./public/images/room-visual.png", 
games:[{name:"Astucia Naval", image:""}], 
caractheristics: "Zona recreativa y de descanso con: Puffs grandes, perfectos para descansar Zona de pintura, crea y diviertete Juegos de mesa de todos los tipos"}]

function QueryRooms(){
    return <>
        <Header person="Estudiante" />
        <div className="main-container">
            <Options />
            <div className="rooms">
            <SlArrowLeftCircle size={100} id="back"/>
                <h2>Reserva o consulta una sala:</h2>
                <div className="cards">{
                    listRooms.map(room => (<Rooms data={room}/>))
                }
                </div>
                
            </div>
        </div>
    </>
}

export default QueryRooms