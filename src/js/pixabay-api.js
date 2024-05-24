const API_KEY = '43884583-1aaf199fc122235264ed6db18';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchPhotosByQuery = async (query, page, perPage) => {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  });

  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  return response.data;
};
