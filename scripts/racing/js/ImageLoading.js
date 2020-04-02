//Car image variables
var carPic = document.createElement("img");
var carPic2 = document.createElement("img");

var trackPics = [];

var picsToLoad = 0;

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	if (picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImages(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "../scripts/racing/images/" + fileName;
}

//Loads the car
function carImageLoad() {
	carPic.onload = countLoadedImagesAndLaunchIfReady;
	carPic.src = "player1car.png";
}

//Loads the walls and roads
function trackImagesLoad() {
	roadPic.onload = countLoadedImagesAndLaunchIfReady;
	wallPic.onload = countLoadedImagesAndLaunchIfReady;
	roadPic.src = "track_road.png";
	wallPic.src = "track_wall.png";
}

function loadImageForTrackCode(trackCode, fileName) {
	trackPics[trackCode] = document.createElement("img");
	beginLoadingImages(trackPics[trackCode], fileName);
}

//Calls the functions that load the car and tracks
function loadImages() {
	var imageList = [
		{varName: carPic, theFile: "player1car.png"},
		{varName: carPic2, theFile: "player2car.png"},
		{trackType: TRACK_ROAD, theFile: "track_road.png"},
		{trackType: TRACK_WALL, theFile: "track_wall.png"},
		{trackType: TRACK_FLAG, theFile: "track_flag.png"},
		{trackType: TRACK_TREE, theFile: "track_tree.png"},
		{trackType: TRACK_GOAL, theFile: "track_goal.png"},
		{trackType: BEFORE_GOAL_CHECK, theFile: "track_road.png"}
		];

	picsToLoad = imageList.length;

	for (var i = 0; i < imageList.length; i++) {
		if (imageList[i].varName != undefined) {
			beginLoadingImages(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile);
		}
	}
}
