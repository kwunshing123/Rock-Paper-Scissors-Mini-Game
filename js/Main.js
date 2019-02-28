/********************key listener ***************************/
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);
/********************end of key listener ********************/

//Game state
var battleChoice = [];
var players = [];
var startChoice = false;
var startOption = false;
var roundStart = true;
var isGameOver, GameWinner, aliveNumber, gameAnimationFrame, lastTime, targets = [];

var noRoundWinner = function(){
		battleChoice.length = 0;
		keysDown = {};
		startChoice = true;
		return "no winner";
};

function addBattleChoice(){

		var checkExistChoice = function(id){
			var found = battleChoice.some(function (e) {
				return e.id === id;
			});
			return found;
		}

		for(var i = 0; i < players.length; i++){
			//AI choice
			if(players[i].isAI && !checkExistChoice(i) && players[i].alive){
				battleChoice.push({"id": i, "choice": Math.floor((Math.random() * 3))});
			}

			//user key press
			if (players[i].keyboardUp in keysDown && !checkExistChoice(i) && players[i].alive) { // Player holding up and entered paper
				battleChoice.push({"id": i, "choice": 0});
			}
			if (players[i].keyboardLeft in keysDown && !checkExistChoice(i) && players[i].alive) { // Player holding left and entered Scissors
				battleChoice.push({"id": i, "choice": 1});
			}
			if (players[i].keyboardRight in keysDown && !checkExistChoice(i) && players[i].alive) { // Player holding right and enter Rock
				battleChoice.push({"id": i, "choice": 2});
			}
			if(checkExistChoice(i)){
				ctx.fillStyle = '#A4A4A4';
				ctx.font = "bold 16pt Arial";
				ctx.fillText("Player "+ (i + 1) + " entered the choice", 280, 500 + i * 30);
				ctx.save();
			}
		}

		checkUserAlive();
    if(battleChoice.length === aliveNumber){
			startChoice = false;
      return battle();
    }
}

function battle(){
  var winner = [];
  var usersChoice = {
    "Paper": 0,
    "Scissors": 0,
    "Rock": 0
  };

  for(var i = 0; i < battleChoice.length; i++){
    switch (battleChoice[i].choice) {
      case 0:
        usersChoice.Paper = 1;
        break;
      case 1:
        usersChoice.Scissors = 1;
        break;
      case 2:
        usersChoice.Rock = 1;
        break;
      default:
        document.write("Error 10001");
    }
  }
  if(usersChoice.Paper && usersChoice.Scissors && usersChoice.Rock){
    return noRoundWinner();
  } else if ((usersChoice.Scissors === 0 && usersChoice.Rock === 0) || (usersChoice.Paper === 0 && usersChoice.Rock === 0) || (usersChoice.Scissors === 0 && usersChoice.Paper === 0)){
    return noRoundWinner();
  } else {
    for(var i = 0; i < battleChoice.length; i++){
      //determine which one is winner
      for(var a = 0; a < battleChoice.length; a++){
        if(battleChoice[i].choice - battleChoice[a].choice === 1 || battleChoice[i].choice - battleChoice[a].choice === -2){
          winner.push(battleChoice[i].id);
          break;
        }
      }
      if(i === battleChoice.length - 1){
        //clear users choice
        battleChoice.length = 0;
				if(winner.length === 1){
					//set winner
					players[winner[0]].roundWinner = true;
					if(players[winner[0]].isAI){
						if(players[winner[0]].checkAllowAttack()){
							//AI attack
							for(var i = 0; i < players.length; i++){
								if(players[i].alive){
									targets[i] = i + 1;
								}
							}
							targets.splice(winner[0], 1);
							targets = $.grep(targets,function(n){ return n == 0 || n });
							players[targets[Math.floor(Math.random() * targets.length)] - 1].equipmentDamage();

							//start new round
							startNewBattle(winner[0]);

						} else {
							//AI add potect
							players[winner[0]].addPotect();
							startNewBattle(winner[0]);
						}
					} else {
						//player's option
						startOption = true;
					}
					return;
				} else {
					//draw
					roundStart = true;
					startOption = false;
					startChoice = true;
				}
        //return the winner
        return winner;
      }
    }
  }
}

function checkUserAlive(){
	aliveNumber = 0;
	for(var i = 0; i < players.length; i++){
		if(players[i].alive){
			aliveNumber++;
		}
	}
	if(aliveNumber === 1){
		endGame();
	}
}

function roundTimer(){
	if(roundStart){
		ctx.drawImage(roundStartImage, 260, 330);
		ctx.fillStyle = '#A4A4A4';
		ctx.font = "bold 20pt Arial";
		ctx.fillText("Waiting all users enter their choice", 220, 450);
		ctx.save();
	}
}

function endGame(){
	for(var i = 0; i < players.length; i++){
		if(players[i].alive){
			GameWinner = players[i].id;
		}
	}
	document.getElementById('game-over').style.display = 'block';
	document.getElementById('winner').innerHTML = 'Player ' + (GameWinner + 1) + 'Win';
	document.getElementById('game-over-overlay').style.display = 'block';
	isGameOver = true;
}

// The main game loop
var main = function () {

	var now = Date.now();
	var dt = (now - lastTime) / 2000.0;

	//draw gmae images
	displayGameImageObject(dt);

	if(openChooseUsersMenu){
		callChooseUsersMenu();
	}

	if(openChooseAIUsersMenu){
		callChooseAIUsersMenu();
	}

	//render
	render();

	lastTime = now;

	// Request to do this again ASAP
	gameAnimationFrame = requestAnimationFrame(main);

	if(isGameOver){
		cancelAnimationFrame(gameAnimationFrame);
	}
}

// Cross-browser support for requestAnimationFrame
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var render = function(){

		//Battle and return winner
		if(startChoice){
			roundTimer();
			addBattleChoice();
		}

		//player's opion
		if(startOption){
			for(var i = 0; i < players.length; i++){
				if(players[i].roundWinner && openTargetMenu){
					callTargetMenu(i);
				} else if (players[i].roundWinner) {
					callOptionMenu(i);
				}
			}
		}
}

var reset = function(){
	document.getElementById('game-over').style.display = 'none';
	document.getElementById('game-over-overlay').style.display = 'none';
	isGameOver = false;
	startChoice = false;
	players = [];
	flags = [];
	for (let i = 0; i < 4; i++) {
		players_plane[i].pos= [-100, -100];
	}

	//Build players
	buildPlayers(1, null, function(err, result){
		if(err){ return err; }
		if(result){
			openChooseUsersMenu = true;
			return result;
		}
	});
	main();
}

function init(){
	//build background
	backgroundPattern = ctx.createPattern(resources.get('img/background.png'), 'repeat');

	//Build players
	buildPlayers(1, null, function(err, result){
		if(err){ return err; }
		if(result){
			openChooseUsersMenu = true;
			return result;
		}
	});
	main();
}

resources.load([
    'img/flag_player1.png',
		'img/flag_player2.png',
		'img/flag_player3.png',
		'img/flag_player4.png',
		'img/plane_player1.png',
		'img/plane_player2.png',
		'img/plane_player3.png',
		'img/plane_player4.png',
		'img/background.png'
]);
resources.onReady(init);
