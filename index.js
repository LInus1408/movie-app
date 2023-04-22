alert('If you are from Belarus or Russia, please enable VPN. The site will not work without a VPN.');

function clearPage() {
  const main = document.querySelector(".main");
  main.innerHTML = "";
}

const chooseLang = () => {
  const langs = document.querySelectorAll(".lang");
  if (langs[1].classList.contains("active-lang")) {
    return "ru";
  } else {
    return "en";
  }
};

async function getDataMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  const main = document.querySelector(".main");
  const urlPoster = "https://image.tmdb.org/t/p/w1280/";
  const langs = document.querySelectorAll(".lang");
  if (data.results.length == 0) {
    let error = document.createElement("div");
    error.className = "error";
    if (langs[1].classList.contains("active-lang")) {
      error.textContent = "Ничего небыло найдено, попробуйте другой поиск";
    } else {
      error.textContent = "Nothing was found, do another search";
    }
    main.append(error);
  }

  for (let i = 0; i < data.results.length; i++) {
    let divCardMovie = document.createElement("div");
    divCardMovie.className = "card-movie";
    main.append(divCardMovie);

    let img = document.createElement("img");
    if (data.results[i].poster_path != null) {
      img.src = urlPoster + data.results[i].poster_path;
      img.alt = data.results[i].title;
      img.className = "img-movie";
      divCardMovie.append(img);
    } else {
      img.src = "./assets/png/error.png";
      img.alt = "error";
      img.className = "img-movie";
      divCardMovie.append(img);
    }

    let movieInfo = document.createElement("div");
    movieInfo.className = "card-movie-info";
    divCardMovie.append(movieInfo);

    let h3 = document.createElement("h3");
    h3.className = "card-movie-title";
    if (langs[1].classList.contains("active-lang")) {
      h3.textContent = data.results[i].title;
    } else {
      h3.textContent = data.results[i].original_title;
    }
    movieInfo.append(h3);

    let span = document.createElement("span");
    span.className = "card-movie-vote_average";
    span.textContent = data.results[i].vote_average;
    let score = data.results[i].vote_average;

    let red = (10 - score) * 25.5;
    let green = score * 25.5;
    span.style.color = `RGB(${red}, ${green}, 0)`;
    movieInfo.append(span);

    let overview = document.createElement("div");
    overview.className = "movie-overview";
    divCardMovie.append(overview);

    let h3overview = document.createElement("h3");
    h3overview.className = "movie-overview-title";
    if (langs[1].classList.contains("active-lang")) {
      h3overview.textContent = "Обзор";
    } else {
      h3overview.textContent = "Overview";
    }
    overview.append(h3overview);

    let descOverview = document.createElement("p");
    descOverview.className = "movie-overview-desc";
    descOverview.textContent = data.results[i].overview;
    overview.append(descOverview);

    let trailerMovie = document.createElement("a");
    trailerMovie.className = "trailer-link";
    if (langs[1].classList.contains("active-lang")) {
      trailerMovie.textContent = "Смотреть трейлер";
    } else {
      trailerMovie.textContent = "Watch trailer";
    }
    descOverview.append(trailerMovie);

    let urlVideos = `https://api.themoviedb.org/3/movie/${data.results[i].id}/videos?api_key=4711a34136289ee747d0411773ecaa6b&language=en-US`;
    let resVideo = await fetch(urlVideos);
    let dataVideo = await resVideo.json();
    if (dataVideo.results.length > 0) {
      let keyVideo = dataVideo.results[0].key;
      let linkVideo = `https://www.youtube.com/watch?v=${keyVideo}`;
      trailerMovie.href = linkVideo;
    } else {
      trailerMovie.href = "/";
      trailerMovie.addEventListener("mouseover", (event) => {
        if (langs[1].classList.contains("active-lang")) {
          trailerMovie.textContent = "Извините, трейлер пока не был добавлен";
        } else {
          trailerMovie.textContent =
            "Sorry, but there is no trailer at the moment";
        }
        trailerMovie.style.color = "red";
      });
    }
  }
}

function pageLoading(lang) {
  const langs = document.querySelectorAll(".lang");
  if (lang == "en") {
    getDataMovies(
      "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=en-US&page=1"
    );
  } else {
    langs[0].classList.remove("active-lang");
    langs[1].classList.add("active-lang");
    getDataMovies(
      "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=ru-RU&page=1"
    );
  }
}

function searchMovie() {
  const btnSearch = document.querySelector(".search");
  const searchPic = document.querySelector(".search-pic");
  const deleteSearch = document.querySelector(".delete-pic");
  const langs = document.querySelectorAll(".lang");

  btnSearch.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      clearPage();
      let movie = btnSearch.value;
      if (langs[1].classList.contains("active-lang")) {
        getDataMovies(
          `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=4711a34136289ee747d0411773ecaa6b&language=ru-Ru`
        );
      } else {
        getDataMovies(
          `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=4711a34136289ee747d0411773ecaa6b`
        );
      }
      event.preventDefault();
    }
  });

  searchPic.addEventListener("click", (event) => {
    clearPage();
    let movie = btnSearch.value;
    if (langs[1].classList.contains("active-lang")) {
      getDataMovies(
        `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=4711a34136289ee747d0411773ecaa6b&language=ru-Ru`
      );
    } else {
      getDataMovies(
        `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=4711a34136289ee747d0411773ecaa6b`
      );
    }
    event.preventDefault();
  });
  deleteSearch.addEventListener("click", (event) => {
    clearPage();
    btnSearch.value = "";
    if (langs[1].classList.contains("active-lang")) {
      getDataMovies(
        "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=ru-RU&page=1"
      );
    } else {
      getDataMovies(
        "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=en-US&page=1"
      );
    }
    event.preventDefault();
  });
}
searchMovie();

function changeLang() {
  const lang = document.querySelector(".change-languages");
  const langs = document.querySelectorAll(".lang");
  const btnSearch = document.querySelector(".search");
  lang.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("lang") &&
      event.target.classList.contains("active-lang") == false
    ) {
      langs.forEach((item) => {
        item.classList.remove("active-lang");
        event.target.classList.add("active-lang");
      });
      if (btnSearch.value == "") {
        clearPage();
        getDataMovies(
          "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=ru-RU&page=1"
        );
      } else {
        let movie = btnSearch.value;
        clearPage();
        getDataMovies(
          `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=4711a34136289ee747d0411773ecaa6b&language=ru-Ru`
        );
      }
    }
  });
}
changeLang();

function setLocalStorage() {
  localStorage.setItem("lang", chooseLang());
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("lang")) {
    const langMain = localStorage.getItem("lang");
    pageLoading(langMain);
  } else {
    getDataMovies(
      "https://api.themoviedb.org/3/movie/popular?api_key=4711a34136289ee747d0411773ecaa6b&language=en-US&page=1"
    );
  }
}
window.addEventListener("load", getLocalStorage);

console.log(
  " 1)Вёрстка (10) \n 2)При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными (10) \n 3) Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово, если такие данные предоставляет API (10)\n 4) Поиск (30) \n 5) Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения (10) "
);
