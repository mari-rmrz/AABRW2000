<!DOCTYPE html>
<html lang=en>
<head>
    <title>Single Painting</title>
    <meta charset=utf-8>
    <script src="js/single-painting.js"></script>
    <link rel="stylesheet" href="css/single-painting.css">
</head>
<body>
    <div class="header"></div>
    <div class="container">
        <div class="section" id="painting-section">
            <img id="image" src=""/>
        </div>
        <div class="section data-container">
            <div class="data-section">
                <span class="heading" id="title"></span><br/>
                <span class="sub-heading" id="artist"></span><br/>
                <span class="sub-heading" id="gallery-year"></span><br/>
                <button id="add-to-favorites">Add To Favorites</button><br/>
            </div>
            <div class="data-section">
                <div id="tab-button-bar">
                    <button class="tab-button open" title="description">Description</button>
                    <button class="tab-button" title="details">Details</button>
                    <button class="tab-button" title="colors">Colors</button>
                </div>
                <div class="tab visible" id="description-tab">
                    <p id="description"></p>
                </div>
                <div class="tab" id="details-tab">
                    <span>Medium: </span><span id="medium"></span><br/>
                    <span>Width: </span><span id="width"></span><br/>
                    <span>Height: </span><span id="height"></span><br/>
                    <span>Copyright: </span><span id="copyright"></span><br/>
                    <span>WikiLink: </span><a id="wiki-link" href=""></a><br/>
                    <span>Museum Link: </span><a id="museum-link" href=""></a><br/>
                </div>
                <div class="tab" id="colors-tab"></div>
            </div>
        </div>
    </div>
</body>
</html>