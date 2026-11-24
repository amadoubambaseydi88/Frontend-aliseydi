// Configuration d'Axios pour communiquer avec le Backend Express
const api = axios.create({
  baseURL: 'https://aliseydi-api.onrender.com/api', // Ton URL Render
  headers: { 'Content-Type': 'application/json' }
});