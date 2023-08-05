import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api"
export const enterRoom = async (room)=>{
    const user = localStorage.getItem('user');
    const response = await axios.post('/room',{
        id:room,
        username:user
    });
    const state = response.data;
    return state;
}

export const getState = async (room) => {
    const res = await axios.post('/refresh',{
        room
    });
    return res.data;
}

export const addRiddle = async (room,riddle,role) => {
    const res = await axios.post('/riddle',{
        room,
        riddle,
        role
    })
    return res.data;
}

export const addGuess = async (room,guess,role) => {
    const res = await axios.post('/guess',{
        room,
        guess,
        role
    })
    return res.data;
}

export const nextRound = async (room) => {
    const res = await axios.post('/next',{
        room
    })
    return res.data;
}