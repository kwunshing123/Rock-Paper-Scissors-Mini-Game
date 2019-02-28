// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 900;
document.getElementById("game").appendChild(canvas);

var castleImage = new Image();
castleImage.src = "img/castle.png";

// Round start image
var roundStartImage = new Image();
roundStartImage.src = "img/round_start.png";

// Tin image
var tinImage = new Image();
tinImage.src = "img/tin.png";

// Han image
var hanImage = new Image();
hanImage.src = "img/han.png";

// Ta image
var taImage = new Image();
taImage.src = "img/ta.png";

// Pin image
var pinImage = new Image();
pinImage.src = "img/pin.png";

// pointer image
var pointerImage = new Image();
pointerImage.src = "img/pointer.png";

const planes_loc = [{"x": 400, "y": 700}, {"x": 425, "y": 155},
					{"x": 155, "y": 445}, {"x": 715, "y": 425}];
var players_plane = [];
var players_flags = [];

for (let i = 1; i < 5; i++) {
	players_plane.push({
		display: false,
		pos: [planes_loc[i-1].x, planes_loc[i-1].y],
		animation: new Animation('img/plane_player' + i + '.png', [0, 0], [39, 39], 16, [0, 1])
	});
	let tmp_arr = [];
	for (let a = 0; a < 3; a++) {
		let x, y;
		switch (i-1) {
			case 0:
				x = 350 + a * 50;
				y = 738;
				break;
			case 1:
				x = 475 - a * 50;
				y = 115;
				break;
			case 2:
				x = 115;
				y = 395 + a * 50;
				break;
			case 3:
				x = 755;
				y = 475 - a * 50;
				break;
		}
		tmp_arr.push({
			display: false,
			pos: [x, y],
			animation: new Animation('img/flag_player' + i + '.png', [0, 0], [32, 32], 16, [0, 1, 2, 3])
		});
	}
	players_flags.push(tmp_arr);
}
