var option = null;
var openTargetMenu = null;
var openChooseUsersMenu, openChooseAIUsersMenu, userAmount, computerAmount;
var attackTargetList = [];

var startNewBattle = function(id){
  players[id].roundWinner = false;
  startOption = false;
  startChoice = true;
  roundStart = true;
};

var confirmOption = function(id, option){
  switch (option) {
    case "Build base":
      players[id].addPotect();
      startNewBattle(id);
      break;
    case "Build aircraft":
      players[id].addPlane();
      startNewBattle(id);
      break;
    case "Attack":
      openTargetMenu = true;
      break;
  }
};

var switchPointer = function(menuName, id){
  if (players[id].keyboardUp in keysDown && menuName.option.length > 1) {
    delete keysDown[players[id].keyboardUp];
    if(menuName.pointerIndex < 1){
      menuName.pointerIndex = menuName.option.length - 1;
    } else {
      --menuName.pointerIndex;
    }
  }
  if (players[id].keyboardDown in keysDown && menuName.option.length > 1) {
    delete keysDown[players[id].keyboardDown];
    if(menuName.pointerIndex < menuName.option.length - 1){
      ++menuName.pointerIndex;
    } else {
      menuName.pointerIndex = 0;
    }
  }
  menuName.pointerY = 515 + menuName.pointerIndex * 25;
}

//Menu constructor
var Menu = function(width, height, optionAmount){
    this.x = 225;
    this.y = 450;
    this.pointerY = 515;
    this.width = 400;
    this.height = 150;
    this.message = null;
    this.nowOption = 0;
    this.option = [];
    this.pointerIndex = 0;

    this.draw = function(){
      ctx.fillStyle="rgba(0, 0, 0, .3)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = "bold 16pt Arial";
      ctx.fillStyle = '#A4A4A4';
    }

    this.drawPointer = function(){
      ctx.drawImage(pointerImage, this.x + 10, this.pointerY);
    }

    this.fillMessage = function(){
      ctx.fillText(this.message, this.x + 25, this.y + 30);
    }

    this.fillOption = function(prefix, postfix){
      var firstOptionY = this.y + 78;
      for(var i = 0; i < this.option.length; i++){
        if(this.option[i] != null){
          ctx.fillText(prefix + this.option[i] + postfix, this.x + 25, firstOptionY);
          firstOptionY += 25;
        }
      }
    }

};

var optionMenu = new Menu();
var targetMenu = new Menu();
var chooseUsersMenu = new Menu();
var chooseAIUsersMenu = new Menu();

function callOptionMenu(id){
    optionMenu.option = [];
    players[id].checkAllowBuildPlane();
    players[id].checkAllowAttack();
    optionMenu.draw();
    optionMenu.message = "Player " + ( id + 1 ) + " win this round";
    if(players[id].allowBuildPlane && players[id].plane === 0){
      optionMenu.option[0] = "Build aircraft";
      optionMenu.option[1] = "Build base";
    } else if(players[id].allowAttack && players[id].plane > 0){
      optionMenu.option[0] = "Attack";
      optionMenu.option[1] = "Build base";
    } else {
      optionMenu.option[0] = "Build base";
    }
    optionMenu.fillMessage();
    optionMenu.fillOption("", "");
    optionMenu.drawPointer();
    switchPointer(optionMenu, id);
    if (13 in keysDown) {
      confirmOption(id, optionMenu.option[optionMenu.pointerIndex]);
      optionMenu.option = [];
      optionMenu.pointerIndex = 0;
      optionMenu.pointerY = 515;
      delete keysDown[13];
      return;
    }
}

function callTargetMenu(id){
    var temp = [];
    targetMenu.option = [];
    targetMenu.draw();
    targetMenu.message = "Select the player you wants to attack";
    targetMenu.fillMessage();
    for(var i = 0; i < players.length; i++){
      if(players[i].alive){
        targetMenu.option[i] = i + 1;
      }
    }
    targetMenu.option.splice(id, 1);
    targetMenu.option = $.grep(targetMenu.option,function(n){ return n == 0 || n });
    targetMenu.drawPointer();
    targetMenu.fillOption("Player", "");
    switchPointer(targetMenu, id);
    if (13 in keysDown) {
      players[targetMenu.option[targetMenu.pointerIndex] - 1].equipmentDamage();
      targetMenu.option = [];
      targetMenu.pointerIndex = 0;
      targetMenu.pointerY = 515;
      startNewBattle(id);
      openTargetMenu = false;
      checkUserAlive();
      delete keysDown[13];
      return;
    }
}

function callChooseUsersMenu(){
    chooseUsersMenu.draw();
    chooseUsersMenu.message = "Please select user amount";
    chooseUsersMenu.fillMessage();
    chooseUsersMenu.option[0] = 1;
    chooseUsersMenu.option[1] = 2;
    chooseUsersMenu.drawPointer();
    chooseUsersMenu.fillOption("", "");
    switchPointer(chooseUsersMenu, 0);
    if (13 in keysDown) {
      userAmount = chooseUsersMenu.option[chooseUsersMenu.pointerIndex];
      chooseUsersMenu.option = [];
      openChooseUsersMenu = false;
      openChooseAIUsersMenu = true;
      delete keysDown[13];
      return;
    }
}

function callChooseAIUsersMenu(){
    chooseAIUsersMenu.draw();
    chooseAIUsersMenu.message = "Please select AI user amount";
    chooseAIUsersMenu.fillMessage();
    for (let i = 0; i < 3; i++) {
      chooseAIUsersMenu.option[i] = i + 2 - userAmount;
    }
    chooseAIUsersMenu.drawPointer();
    chooseAIUsersMenu.fillOption("", "");
    switchPointer(chooseAIUsersMenu, 0);
    if (13 in keysDown) {
      computerAmount = chooseAIUsersMenu.option[chooseAIUsersMenu.pointerIndex];
      chooseAIUsersMenu.option = [];
      openChooseAIUsersMenu = false;
      players = [];
      buildPlayers(userAmount, computerAmount, function(err, result){
        if(err){ return err; }
        if(result){
          startChoice = true;
          return result;
        }
      });
      delete keysDown[13];
    }
}

function informationBar(id){
  var fillInfo = function(id, x, y){
    ctx.fillStyle="rgba(0, 0, 0, .3)";
    ctx.fillRect(x - 10, y - 25, 200, 130);
    ctx.fillStyle="#A4A4A4";
    ctx.font = "bold 13pt Arial";
    ctx.fillText("Player" + (id + 1), x, y);
    ctx.fillText("Life: " + players[id].life, x, y + 30);
    ctx.fillText("Flag: " + players[id].flag, x, y + 50);
    ctx.fillText("Plane: " + players[id].plane, x, y + 70);
    ctx.fillText("Castle: " + players[id].potect + " /100", x, y + 90);
  };

  switch (id) {
    case 0:
      fillInfo(id, 650, 795);
      break;
    case 1:
      fillInfo(id, 150, 30);
      break;
    case 2:
      fillInfo(id, 30, 600);
      break;
    case 3:
      fillInfo(id, 700, 200);
      break;
  }
}
