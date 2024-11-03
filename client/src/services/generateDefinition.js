import axios from 'axios';

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Fetch the definition for a given word
export const generateDefinition = async (word) => {
  try {
    const response = await axios.get(`${DICTIONARY_API_URL}/${word}`);
    const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition;
    return { definition };
  } catch (error) {
    console.error('Error fetching definition:', error);
    return { definition: 'Definition not found' };
  }
};
