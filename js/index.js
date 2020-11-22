let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.89474, lng: 12.4839 },
    mapTypeId: "satellite",
    zoom: 18,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const galleryEndpoint =
    "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
  const paintingsEndpoint =
    "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=";
  const paintingImagesEndpoint =
    "https://res.cloudinary.com/funwebdev/image/upload/w_100/art/paintings/square/";
  let galleries = [];
  let paintings = [];

  fetch(galleryEndpoint)
    .then((response) => {
      document.querySelector("#loader1").style.display = "inline-block";
      return response.json();
    })
    .then((data) => {
      document.querySelector("#loader3").style.display = "none";
      document.querySelector("div.b section").style.display = "block";
      document.querySelector("#galleryList").style.display = "block";

      galleries.push(...data); //fill galleries array with data

      // galleries were already sorted by gallery name but we sorted anyways per asg specs
      galleries = galleries.sort(function (a, b) {
        if (a.GalleryName < b.GalleryName) return -1;
        else if (a.GalleryName > b.GalleryName) return 1;
        else return 0;
      });

      galleries.forEach((gallery) => {
        let galleryListItem = document.createElement("li");
        galleryListItem.textContent = gallery.GalleryName;
        galleryListItem.setAttribute("data-key", gallery.GalleryID);
        galleryListItem.setAttribute("data-longitude", gallery.Longitude);
        galleryListItem.setAttribute("data-latitude", gallery.Latitude);
        document.querySelector("#galleryList").appendChild(galleryListItem);

        //https://davidwalsh.name/event-delegate
      });
    })
    .catch((error) => console.error(error));

  toggleGalleryList();

  document.querySelector("#galleryList").addEventListener("click", (e) => {
    if (e.target.nodeName == "LI") {
      paintings = [];
      changeMap(e);
      let galleryID = e.target.getAttribute("data-key");

      fetch(paintingsEndpoint + galleryID)
        .then((response) => {
          document.querySelector("#loader1").style.display = "inline-block";
          document.querySelector("#loader2").style.display = "inline-block";

          return response.json();
        })
        .then((data) => {
          document.querySelector("#paintingsList").innerHTML = " ";
          document.querySelector("#loader1").style.display = "none";
          document.querySelector("#loader2").style.display = "none";

          document.querySelector("div.a section").style.display = "block";
          document.querySelector("div.c section").style.display = "grid";

          let foundGallery;
          for (gallery of galleries) {
            if (gallery.GalleryID == galleryID) {
              foundGallery = gallery;
            }
          }
          changeGalleryDetails(foundGallery);

          let paintingsListHeader = document.createElement("tr");
          paintingsListHeader.innerHTML = `<th></th><th id="tableArtist">Artist</th><th id="tableTitle">Title</th><th id="tableYear">Year</th>`;
          document
            .querySelector("#paintingsList")
            .appendChild(paintingsListHeader);

          paintings.push(...data); //inputs paintings objects into

          // sorting by artist last name by default
          paintings = paintings.sort(function (a, b) {
            if (a.LastName < b.LastName) return -1;
            else if (a.LastName > b.LastName) return 1;
            else return 0;
          });

          paintings.forEach((painting) => {
            let paintingsListItem = document.createElement("tr");

            paintingsListItem.innerHTML = `<td><img data-key=${
              painting.ImageFileName
            } src= ${
              paintingImagesEndpoint + painting.ImageFileName
            }></img></td><td>${painting.LastName}</td><td>${
              painting.Title
            }</td><td>${painting.YearOfWork}</td>`;
            document
              .querySelector("#paintingsList")
              .appendChild(paintingsListItem);
          });
        })
        .catch((error) => console.error(error));
    }
  });

  // listener for tiny img to switch to larger img display
  document.querySelector("#paintingsList").addEventListener(
    "click",
    (e) => {
      if (e.target.nodeName == "IMG") {
        document.querySelector("#largeImageView").style.display = "grid";
        document.querySelector("main").style.display = "none";

        const filepath =
          "https://res.cloudinary.com/funwebdev/image/upload/art/paintings/";
        let clickedImg = e.target.src.replaceAll("w_100/", "w_300/");
        document.querySelector("#largeImage").setAttribute("src", clickedImg);

        for (painting of paintings) {
          if (e.target.getAttribute("data-key") == painting.ImageFileName) {
            changeLargeImageDetails(painting);
            displayColors(painting);
            expandPaintingModal(painting);
          }
        }
      }
    },
    { capture: true }
  );

  document.querySelector("#closeLargeImage").addEventListener("click", (e) => {
    document.querySelector("#largeImageView").style.display = "none";
    document.querySelector("main").style.display = "grid";
  });

  document.querySelector("#paintingsList").addEventListener("click", (e) => {
    if (e.target && e.target.matches("#tableYear")) {
      document.querySelector("#paintingsList").innerHTML = " ";
      paintings = paintings.sort(function (a, b) {
        if (a.YearOfWork < b.YearOfWork) return -1;
        else if (a.YearOfWork > b.YearOfWork) return 1;
        else return 0;
      });
      generatePaintingsList(paintings);
    }
    if (e.target && e.target.matches("#tableArtist")) {
      document.querySelector("#paintingsList").innerHTML = " ";
      paintings = paintings.sort(function (a, b) {
        if (a.LastName < b.LastName) return -1;
        else if (a.LastName > b.LastName) return 1;
        else return 0;
      });
      generatePaintingsList(paintings);
    }
    if (e.target && e.target.matches("#tableTitle")) {
      document.querySelector("#paintingsList").innerHTML = " ";
      paintings = paintings.sort(function (a, b) {
        if (a.Title < b.Title) return -1;
        else if (a.Title > b.Title) return 1;
        else return 0;
      });
      generatePaintingsList(paintings);
    }
  });

  function generatePaintingsList(paintings) {
    let paintingsListHeader = document.createElement("tr");
    paintingsListHeader.innerHTML = `<th></th><th id="tableArtist">Artist</th><th id="tableTitle">Title</th><th id="tableYear">Year</th>`;
    document.querySelector("#paintingsList").appendChild(paintingsListHeader);
    paintings.forEach((painting) => {
      let paintingsListItem = document.createElement("tr");
      paintingsListItem.innerHTML = `<td><img data-key=${
        painting.ImageFileName
      } src= ${
        paintingImagesEndpoint + painting.ImageFileName
      }></img></td><td>${painting.LastName}</td><td>${painting.Title}</td><td>${
        painting.YearOfWork
      }</td>`;
      document.querySelector("#paintingsList").appendChild(paintingsListItem);
    });
  }

  // test your knowledge 2 lab 9 for help with dominant colors
  function displayColors(painting) {
    for (let color of painting.JsonAnnotations.dominantColors) {
      span = document.createElement("span");
      span.setAttribute("style", "background-color:" + color.web);
      span.setAttribute("title", color.web);
      document.querySelector("#colors").appendChild(span);
    }
  }
}); // dom content loaded

// hides and shows gallery list with button click
function toggleGalleryList() {
  const toggleButton = document.querySelector("#toggleButton");

  toggleButton.addEventListener(
    "click",
    (e) => {
      let galleryColumn = document.querySelector("div.b");
      galleryColumn.classList.toggle("hidden");

      if (toggleButton.value == "Show Galleries") {
        toggleButton.value = "Hide Galleries";
        document.querySelector(".container").style.gridTemplateColumns =
          "1fr 1fr 1fr 1fr";
      } else if (toggleButton.value == "Hide Galleries") {
        toggleButton.value = "Show Galleries";
        document.querySelector(".container").style.gridTemplateColumns =
          "0fr 1fr 1fr 1fr";
      }

      e.stopPropagation();
    },
    { capture: true }
  );
}

// shows and hides the pop up modal when a painting in the large painting view is clicked
function expandPaintingModal(painting) {
  document.querySelector("#largeImage").addEventListener("click", (e) => {
    document.querySelector("#modalContainer").style.display = "inline-block";
    document.querySelector("body").style.margin = "0px";

    const filepath =
      "https://res.cloudinary.com/funwebdev/image/upload/art/paintings/";
    let clickedImg = e.target.src.replaceAll("w_300/", "w_800/");
    document.querySelector("#popupModal").setAttribute("src", clickedImg);
  });
  document.querySelector("#popupModal").addEventListener("click", (e) => {
    document.querySelector("#modalContainer").style.display = "none";
  });
}

function changeLargeImageDetails(painting) {
  document.querySelector("#paintingTitle").textContent = painting.Title;
  document.querySelector("#artistFirstName").textContent = painting.FirstName;
  document.querySelector("#artistLastName").textContent = painting.LastName;
  document.querySelector("#paintingYearOfWork").textContent =
    painting.YearOfWork;
  document.querySelector("#paintingMedium").textContent = painting.Medium;
  document.querySelector("#paintingHeight").textContent = painting.Height;
  document.querySelector("#paintingWidth").textContent = painting.Width;

  // to make copyright symbol show up properly, replace &copy; with unicode
  // https://stackoverflow.com/questions/8095624/how-to-add-copyright-symbol-in-a-highcharts-title
  document.querySelector(
    "#copyright"
  ).textContent = painting.CopyrightText.replace("&copy; ", "\u00A9 ");

  document.querySelector("#paintingGalleryName").textContent =
    painting.GalleryName;
  document.querySelector("#paintingGalleryCity").textContent =
    painting.GalleryCity;
  document.querySelector("#museumLink").textContent = painting.MuseumLink;
  document.querySelector("#museumLink").href = painting.MuseumLink;
  document.querySelector("#paintingDescription").textContent =
    painting.Description;
}

function changeGalleryDetails(gallery) {
  document.querySelector("#galleryName").textContent = gallery.GalleryName;
  document.querySelector("#galleryNative").textContent =
    gallery.GalleryNativeName;
  document.querySelector("#galleryCity").textContent = gallery.GalleryCity;
  document.querySelector("#galleryAddress").textContent =
    gallery.GalleryAddress;
  document.querySelector("#galleryCountry").textContent =
    gallery.GalleryCountry;
  document.querySelector("#galleryHome").textContent = gallery.GalleryWebSite;
  // Set GalleryWebSite to a working link
  document.querySelector("#galleryHome").href = gallery.GalleryWebSite;
  // optional. Opens page in new tab
  document.querySelector("#galleryHome").setAttribute("target", "_blank");
}

// used this site to help with paseFloat problem.
//https://stackoverflow.com/questions/44878472/errorinvalidvalueerror-setcenter-not-a-latlng-or-latlngliteral-in-property-l
function changeMap(e) {
  let longitude = e.target.getAttribute("data-longitude");
  let latitude = e.target.getAttribute("data-latitude");
  longitude = parseFloat(longitude);
  latitude = parseFloat(latitude);
  map.setCenter({ lat: latitude, lng: longitude });
  map.setZoom(18);
}
// this site helped me look up stuff about google maps methods
// https://developers.google.com/earth-engine/apidocs/map-setzoom

// live share invite
//https://prod.liveshare.vsengsaas.visualstudio.com/join?3E5F5978CF97248E71E34EBAA2D405F28718

//https://prod.liveshare.vsengsaas.visualstudio.com/join?A6967840FF3762950676184131CF3D0C6801
