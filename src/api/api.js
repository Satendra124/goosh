import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";


export const enterRoom = async (room, attributes) => {
    console.log(room, attributes);
    if(attributes.length === 0) {
        throw new Error('Please select at least one attribute');
    }
    const response = await axios.post('/room', {
        room_id: room,
        player_id: localStorage.getItem('user'),
        attributes: attributes
    });
    const state = response.data;
    return state;
}

export const getState = async (room) => {
    const res = await axios.post('/refresh', {
        room,
        username: localStorage.getItem('user')
    });
    return res.data;
}

export const sendMessage = async (room, message) => {
    const res = await axios.post(`/room/${room}/message`, {
        player_id: localStorage.getItem('user'),
        message
    });
    return res.data;
}

export const getRoom = async (room) => {
    const res = await axios.get(`/room/${room}`);
    return res.data;
}