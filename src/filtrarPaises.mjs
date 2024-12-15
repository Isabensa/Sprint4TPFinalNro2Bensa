import axios from 'axios';

const filtrarPaises = async () => {
  try {
    // Consumir la API para obtener la lista completa de países
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const paises = response.data;

    // Filtrar los países que hablan español (spa: "Spanish")
    const paisesHispanohablantes = paises.filter(pais =>
      pais.languages && Object.keys(pais.languages).includes('spa')
    );

    // Limpiar las propiedades innecesarias y agregar la propiedad "creador"
    const paisesProcesados = paisesHispanohablantes.map(pais => {
      const {
        translations,
        tld,
        cca2,
        ccn3,
        cca3,
        cioc,
        idd,
        altSpellings,
        car,
        coatOfArms,
        postalCode,
        demonyms,
        ...resto
      } = pais;

      return {
        ...resto,
        creador: 'TuNombreReal', // Cambia "TuNombreReal" por tu nombre real
      };
    });

    // Mostrar los resultados en consola
    console.log('Países procesados:', paisesProcesados.length);
    console.log(paisesProcesados);

    return paisesProcesados;
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta de la API:', error.response.status);
    } else if (error.request) {
      console.error('No se recibió respuesta de la API:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
};

// Ejecutar la función
filtrarPaises();
