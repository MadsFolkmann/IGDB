"use strict";
let games;
const endpoint = "https://igdb-913a7-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", initApp);

async function initApp() {
  console.log("VELKOMMEN TIL IGDB");
  updateGrid();

  document.querySelector("#btn-create-game").addEventListener("click", showCreateModal);
  document.querySelector("#form-delete-game").addEventListener("submit", deleteGameClicked); 
  document.querySelector("#form-delete-game").addEventListener("click", deleteGameClickedNo);
  //Update//
  document.querySelector("#form-update-game").addEventListener("submit", updateGameClicked);
  document.querySelector("#sort-games").addEventListener("change", sortBy);

  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

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

// ---------------------Create game-----------------------//

function showCreateModal() {
    const dialog = document.querySelector("#dialog-create-game");

        dialog.showModal();

        document.querySelector("#createGame").addEventListener("submit", createGameClicked);


    dialog.querySelector(".close").addEventListener("click", () => {
          dialog.close();
    });
}

function createGameClicked(event) {
  event.preventDefault();

  const form = event.target;

  const title = form.title.value;
  const rating = form.rating.value;
  const image = form.image.value;

  createPost(title, image, rating);

  form.reset();

  document.querySelector("#dialog-create-game").close();
}

async function createPost(title, image, rating) {
  const newPost = {
    title: title,
    image: image,
    rating: rating,
  };
  const postAsJson = JSON.stringify(newPost);

  const response = await fetch(`${endpoint}/games.json`, { method: "POST", body: postAsJson });

  if (response.ok) {
    console.log("Post succesful in firebase(❁´◡`❁)");
    updateGrid();
  }
}

//----------------Update Grid---------------//

    async function updateGrid() {
        games = await getGames();
        displayGames(games);
    }

    //----------------------Games-----------------------//
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
        document.querySelector("#games article:last-child .btn-update").addEventListener("click", () => updateClicked(gameObject));
        document.querySelector("#games article:last-child .btn-delete").addEventListener("click", () => deleteClicked(gameObject));


    }

    //-------------------Update and Delete----------------------//

    //update
    function updateClicked(gameObject) {
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
        });
    }

    function updateGameClicked(event) {
        event.preventDefault();
        const form = event.target;
        const id = event.target.getAttribute("data-id");

        const title = form.title.value;
        const rating = form.rating.value;
        const image = form.image.value;
        const genre = form.genre.value
        const resume = form.resume.value

        updateGame(id, title, rating, image, genre, resume);
        document.querySelector("#dialog-update-game").close();
    }

    async function updateGame(id, title, rating, image, genre, resume) {
        const updatedGame = {
            title: title,
            rating: rating,
            image: image,
            genre: genre,
            resume: resume
        };

        const json = JSON.stringify(updatedGame);
        const response = await fetch(`${endpoint}/games/${id}.json`, { method: "PUT", body: json });
  
        if (response.ok) {
            console.log("Game succesfully updated in firbase🐱🐱");
            updateGrid();
        }
    }
    
    //delete
    function deleteClicked(gameObject) {
        console.log("Delete button clicked");
        document.querySelector("#title-of-the-game").textContent = gameObject.title;
        document.querySelector("#form-delete-game").setAttribute("data-id", gameObject.id);
        document.querySelector("#dialog-delete-game").showModal();
        
    }
    
    function deleteGameClicked(event) {
        console.log(event);
        const id = event.target.getAttribute("data-id");
        deleteGame(id);
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



