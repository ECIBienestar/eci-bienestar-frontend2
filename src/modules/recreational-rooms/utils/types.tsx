export type Game = {
    name: string;
    image: string;
}


export type room = {
    name: string,
    description: string,
    image: string
    games?: Game[],
    caractheristics: String
}

export type reservation = {
    room: string,
    date: string,
    time: string,
    elementsResume: string,
    elements?: Game[] 
    image: string
}