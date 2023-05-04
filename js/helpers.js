const endpoint = "https://igdb-913a7-default-rtdb.europe-west1.firebasedatabase.app/";

export { endpoint, sortBy, inputSearchChanged, searchGames };

// ---------------------filter and Sort games-----------------------//

function inputSearchChanged(event) {
  const value = event.target.value;
  const gamesToShow = searchGames(value);
  displayGames(gamesToShow);
}

const searchGames = (searchValue) => {
  searchValue = searchValue.toLowerCase();

  return games.filter((game) => game.title.toLowerCase().includes(searchValue));
};

function sortBy(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "title") {
    games.sort((game1, game2) => game1.title.localeCompare(game2.title));
  } else if (selectedValue === "rating") {
    games.sort((game1, game2) => game2.rating - game1.rating);
  }

  displayGames(games);
}


//  function filterGames(event) {
//    const filterSelect = event.target;
//    if (filterSelect.value !== "none") {
//      horseArr = horseArr.filter((horse) => horse["gender"] === filterSelect.value);
//      showHorses(horseArr);
//    } else {
//    }
//  }

