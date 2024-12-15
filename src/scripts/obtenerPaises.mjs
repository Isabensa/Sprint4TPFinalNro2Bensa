import axios from 'axios';

const probarConexion = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    console.log('Conexión exitosa:', response.status);
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta de la API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta de la API:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
};

probarConexion();
