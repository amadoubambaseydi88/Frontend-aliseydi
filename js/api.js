// Configuration d'Axios pour communiquer avec le Backend Express
const api = axios.create({
  // En local, ton backend tourne sur le port 5000
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});