import { v4 as uuidv4 } from 'uuid';

export const CARD_COVER =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fit/w_828,h_1148/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-414w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA';

export const API_URL =
  'https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/';

export const generateCards = (amount) => {
  const cards = Array.from({ length: amount / 2 }, (_, idx) => ({
    id: uuidv4(),
    src: API_URL + (idx + 1) + '.svg',
    matched: false,
  }));
  const clonedCards = cards.map((clone) => ({ ...clone, id: uuidv4() }));
  return [...cards, ...clonedCards];
};
