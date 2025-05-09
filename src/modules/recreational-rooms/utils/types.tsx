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
    elements: string,
    image: string
}