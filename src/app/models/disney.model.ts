// Representa la respuesta que recibimos de la API.
export interface DisneyResponse {
  info: {
    count: number;
    totalPages: number;
    nextPage: string | null;
    previousPage?: string | null;
  };

  // La API puede devolver un personaje, varios o ninguno.
  data: DisneyCharacter | DisneyCharacter[] | null;
}

// Define la información que puede tener un personaje.
export interface DisneyCharacter {
  _id: number;
  name: string;
  imageUrl?: string;
  films?: string[];
  tvShows?: string[];
  videoGames?: string[];
  parkAttractions?: string[];
}