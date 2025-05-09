import { GoBell } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

type messageProps ={
    person: string;
}

function Header({person }: messageProps){
    return <div className='header-container'>
        <h1>ECI Bienestar</h1>
        <h2>Hola, {person}</h2>
        <GoBell size={30} id="bell"/>
        <FiUser size={30} id="user"/>
        <MdLogout size={30} id="logout"/>

    </div>
}

export default Header