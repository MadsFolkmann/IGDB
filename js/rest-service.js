const endpoint = "https://igdb-913a7-default-rtdb.europe-west1.firebasedatabase.app/";

export { endpoint, getGames, prepareGameData, createPost, updateGame, deleteGame };

async function getGames() {
  const response = await fetch(`${endpoint}/games.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const games = prepareGameData(data);
  return games;
}

async function prepareGameData(dataObject) {
  const gameArray = [];
  for (const key in dataObject) {
    const games = dataObject[key];
    games.id = key;
    gameArray.push(games);
  }
  return gameArray;
}

async function createPost(title, image, rating) {
  const newPost = {
    title: title,
    image: image,
    rating: rating,
  };
  const postAsJson = JSON.stringify(newPost);

  const response = await fetch(`${endpoint}/games.json`, { method: "POST", body: postAsJson });

  return response;
}

async function updateGame(id, title, rating, image, genre, resume) {
  const updatedGame = {
    title: title,
    rating: rating,
    image: image,
    genre: genre,
    resume: resume,
  };

  const json = JSON.stringify(updatedGame);
  const response = await fetch(`${endpoint}/games/${id}.json`, { method: "PUT", body: json });

  return response;
}

async function deleteGame(id) {
  const response = await fetch(`${endpoint}/games/${id}.json`, {
    method: "DELETE",
  });
  return response;
}
