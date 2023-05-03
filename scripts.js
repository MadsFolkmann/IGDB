"use strict";

const endpoint = "https://igdb-913a7-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", initApp);

async function initApp() {
  console.log("VELKOMMEN TIL IGDB");
  games = await getGames();
  displayGames(games);
}

async function getGames() {
  const response = await fetch(`${endpoint}/games.json`);
  const data = await response.json();
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

function displayGames(listOfGames) {
  document.querySelector("#games").innerHTML = "";
  for (const game of listOfGames) {
    showGames(game);
  }
}

function showGames(gameObject) {
  const html = /*html*/ `
    <article class="grid-item">
      <img src= ${gameObject.image}/>
      <div class="grid-info">
        <h2>${gameObject.title}</h2>
        <p>${gameObject.rating}</p>
      </div>
      <div class="btns">
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
      </div>
    </article>
  ;`;

  document.querySelector("#games").insertAdjacentHTML("beforeend", html);
}
