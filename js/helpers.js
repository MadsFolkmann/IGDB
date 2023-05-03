export { sortBy, inputSearchChanged };

// ---------------------filter and Sort games-----------------------//

function inputSearchChanged(event) {
  const value = event.target.value;
  const postsToShow = searchGames(value);
  displayGames(postsToShow);
}

function searchGames(searchValue) {
  searchValue = searchValue.toLowerCase();

  const results = games.filter(checkTitle);

  function checkTitle(game) {
    const title = game.title.toLowerCase();
    return title.includes(searchValue);
  }

  return results;
}

function sortBy(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "title") {
    games.sort((game1, game2) => game1.title.localeCompare(game2.title));
  } else if (selectedValue === "rating") {
    games.sort((game1, game2) => game2.rating - game1.rating);
  }

  displayGames(games);
}
