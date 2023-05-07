"use strict";

import { endpoint, getGames, prepareGameData, createPost, updateGame, deleteGame } from "./rest-service.js";
// import { sortBy, inputSearchChanged, searchGames } from "./helpers.js";

let games;
endpoint;
window.addEventListener("load", initApp);

function initApp() {
  console.log("VELKOMMEN TIL IGDB");
  updateGrid();

  //Create//
  document.querySelector("#btn-create-game").addEventListener("click", showCreateModal);

  //Delete//
  document.querySelector("#form-delete-game").addEventListener("submit", deleteGameClicked);
  document.querySelector("#form-delete-game").addEventListener("click", deleteGameClickedNo);

  //Update//
  document.querySelector("#form-update-game").addEventListener("submit", updateGameClicked);

  //Sort - Filter//

  document.querySelector("#sort-games").addEventListener("change", sortBy);

  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);

  document.querySelector("#filter-games").addEventListener("change", filterGamesChanged);
}

// ---------------------filter and Sort games-----------------------//

function filterGamesChanged(event) {
  const value = event.target.value;
  console.log(value);
  const gamesToShow = filterGames(value);
  console.log(gamesToShow);
  displayGames(gamesToShow);
}

function filterGames(filterSelected) {
  console.log(filterSelected);
  console.log(games);
  return games.filter((game) => game.genre.includes(filterSelected));
}

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
// ---------------------Create game-----------------------//

function showCreateModal() {
  const dialog = document.querySelector("#dialog-create-game");

  dialog.showModal();

  document.querySelector("#createGame").addEventListener("submit", createGameClicked);

  dialog.querySelector(".close").addEventListener("click", () => {
    dialog.close();
  });
}

async function createGameClicked(event) {
  event.preventDefault();

  const form = event.target;

  const title = form.title.value;
  const rating = form.rating.value;
  const image = form.image.value;

  const response = await createPost(title, image, rating);

  if (response.ok) {
    form.reset();
    updateGrid();
  }
  document.querySelector("#dialog-create-game").close();
}
createPost();

//----------------Update Grid---------------//

async function updateGrid() {
  games = await getGames();
  displayGames(games);
}

//----------------------Games-----------------------//
getGames();

prepareGameData();

function displayGames(listOfGames) {
  document.querySelector("#games").innerHTML = "";
  for (const game of listOfGames) {
    showGames(game);
  }
}

function showGames(gameObject) {
  const html = /*html*/ `
    <article class="grid-item">
      <img src= "${gameObject.image}"/>
      <div class="grid-info">
        <h2>${gameObject.title}</h2>
        <p>${gameObject.rating}⭐</p>
      </div>
      <div class="btns">
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
      </div>
    </article>
  `;

  document.querySelector("#games").insertAdjacentHTML("beforeend", html);
    document.querySelector("#games article:last-child .btn-update").addEventListener("click", (event) => {
      event.stopPropagation();
      updateClicked(gameObject);
    });
    document.querySelector("#games article:last-child .btn-delete").addEventListener("click", (event) => {
      event.stopPropagation();
      deleteClicked(gameObject);
    });
  document.querySelector("#games article:last-child").addEventListener("click", () => gameClicked(gameObject));
}

//-------------------Show Dialog----------------------//

function gameClicked(gameObject) {
  console.log("Detail view opened");
  showDialog(gameObject);
  document.querySelector("#dialog-show").showModal();
}

function showDialog(gameObject) {
  document.querySelector("#image").src = gameObject.image;
  document.querySelector("#title").textContent = gameObject.title;
  document.querySelector("#resume").textContent = gameObject.resume;
  document.querySelector("#rating").textContent = gameObject.rating;
  document.querySelector("#genre").textContent = gameObject.genre;
}

//-------------------Update and Delete----------------------//

//update
function updateClicked(gameObject) {
  console.log("Update button clicked");
  const updateForm = document.querySelector("#form-update-game");
  const dialog = document.querySelector("#dialog-update-game");

  updateForm.title.value = gameObject.title;
  updateForm.image.value = gameObject.image;
  updateForm.resume.value = gameObject.resume;
  updateForm.genre.value = gameObject.genre;
  updateForm.rating.value = gameObject.rating;
  document.querySelector("#form-update-game").setAttribute("data-id", gameObject.id);
  dialog.showModal();

  //Closes dialog on x click
  dialog.querySelector(".close").addEventListener("click", () => {
    dialog.close();
    console.log("Update view closed");
  });
}

async function updateGameClicked(event) {
  console.log("Update button clicked");
  event.preventDefault();
  const form = event.target;
  const id = event.target.getAttribute("data-id");

  const title = form.title.value;
  const rating = form.rating.value;
  const image = form.image.value;
  const genre = form.genre.value;
  const resume = form.resume.value;
  const response = await updateGame(id, title, rating, image, genre, resume); // use values to create a new post
  if (response.ok) {
    updateGrid();

    updateGame(id, title, rating, image, genre, resume);
  }
  document.querySelector("#dialog-update-game").close();
}

updateGame();

//delete

deleteGame();

function deleteClicked(gameObject) {
  console.log("Delete button clicked");
  document.querySelector("#title-of-the-game").textContent = gameObject.title;
  document.querySelector("#form-delete-game").setAttribute("data-id", gameObject.id);
  document.querySelector("#dialog-delete-game").showModal();
}

async function deleteGameClicked(event) {
  console.log(event);
  const id = event.target.getAttribute("data-id");
  const response = await deleteGame(id);
  if (response.ok) {
    deleteGame(id);
    updateGrid();
  }
  document.querySelector("#dialog-delete-game").close();
}

function deleteGameClickedNo() {
  console.log("Close delete dialog");
  document.querySelector("#dialog-delete-game").close();
}

//-------Refresh ved click af IGDB-------//
const igdbImg = document.querySelector("#igdb-img");

igdbImg.addEventListener("click", () => {
  location.reload();
});
