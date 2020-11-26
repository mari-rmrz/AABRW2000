document.addEventListener("DOMContentLoaded", function() {
    const paintingsPath = "images/paintings/full/";
    const imageExtension = ".jpg";

    let tabButtons = document.querySelectorAll(".tab-button");
    for (let button of tabButtons) {
        console.log(button.title);
        button.addEventListener('click', function() {
            toggleTabs(button);
        });
    }
    
    function toggleTabs(tabButton) {
        resetTabs();
        let title = tabButton.title;
        console.log(title);
        
        if (title == "description") {
            tabButton.classList.toggle("open");
            document.getElementById("description-tab").classList.toggle("visible");
        }
        else if (title == "details") {
            tabButton.classList.toggle("open");
            document.getElementById("details-tab").classList.toggle("visible");
        }
        else if (title == "colors") {
            tabButton.classList.toggle("open");
            document.getElementById("colors-tab").classList.toggle("visible");
        }
    }
    
    function resetTabs() {
        var tabs = document.querySelectorAll(".tab");
        for (let tab of tabs) {
            tab.classList.remove("visible");
        }
        
        var tabButtons = document.querySelectorAll(".tab-button");
        for (let button of tabButtons) {
            button.classList.remove("open");
        }
    }

    function getPainting(id) {
        let url = 'api-galleries.php?id=' + id;
        fetch(url)
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
            }) 
            .then( data => { outputPainting(data[0]); });
    }

    function outputPainting(painting) {
        console.log(painting);
        let fileName = getFileName(painting.ImageFileName);
        document.getElementById("image").src = paintingsPath + fileName + imageExtension;
        document.getElementById("title").innerHTML = painting.Title;
        document.getElementById("artist").innerHTML = painting.FirstName + " " + painting.LastName;
        document.getElementById("gallery-year").innerHTML = painting.GalleryName + ", " + painting.YearOfWork;
        document.getElementById("description").innerHTML = painting.Description;
        document.getElementById("medium").innerHTML = painting.Medium;
        document.getElementById("height").innerHTML = painting.Height + '"';
        document.getElementById("width").innerHTML = painting.Width + '"';
        document.getElementById("copyright").innerHTML = painting.CopyrightText;
        document.getElementById("wiki-link").href = painting.WikiLink;
        document.getElementById("wiki-link").innerHTML = painting.WikiLink;
        document.getElementById("museum-link").href = painting.MuseumLink;
        document.getElementById("museum-link").innerHTML = painting.MuseumLink;
        setPaintingColors(painting);
    }

    function setPaintingColors(selectedPainting) {
        let paintingData = JSON.parse(selectedPainting.JsonAnnotations);
        let paintingColors = paintingData.dominantColors;
        document.getElementById("colors-tab").innerHTML = "";

        for (let color of paintingColors) {
            var span = document.createElement("span");
            span.classList.add("painting-color");
            span.title = color.name + ", " + color.web;
            span.style.backgroundColor = color.web;
            document.getElementById("colors-tab").appendChild(span);
        }
    }

    function getFileName(fileName) {
        let length = fileName.toString().length;
        let diff = 6 - length;

        var newFileName = "";
        for (i=0;i<diff;i++) {
            newFileName += "0";
        }

        newFileName += fileName;
        return newFileName;
    }

    let url = new URLSearchParams(location.search); 
    let id = url.get("id");
    getPainting(id);
});