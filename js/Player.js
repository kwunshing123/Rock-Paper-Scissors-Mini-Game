function player(id, isAI){
    this.id = id;
    this.life = 0;
    this.flag = 0;
    this.potect = 0;
    this.alive = true;
    this.roundWinner = false;
    this.allowBuildPlane = false;
    this.plane = 0;

    if(isAI){
      this.isAI = true;
    }

    this.addPotect = function(){
      if(this.life < 4){
        this.life++;
      } else if(this.life >= 4 && this.flag < 3){
        this.flag++;
      } else if(this.potect < 100){
        this.potect+=10;
      }
    }

    this.addPlane = function(){
      if(this.allowBuildPlane){
        this.plane++;
      }
    }

    this.equipmentDamage = function(){
      if(this.plane > 0){
        this.plane--;
      } else if(this.potect > 0){
        this.potect -= 10;
      } else if(this.flag > 0){
        this.flag--;
      } else {
        this.life--;
      }
      if(this.life === -1){
        this.alive = false;
        aliveNumber--;
      }
    }

    this.checkAllowBuildPlane = function(){
      if(this.life > 3 && this.flag > 2 && this.potect > 9){
        this.allowBuildPlane = true;
      } else {
        this.allowBuildPlane = false;
      }
    }

    this.checkAllowAttack = function(){
      if(this.allowAttack || (this.life > 3 && this.flag > 2 && this.potect > 9 && this.plane > 0)){
        this.allowAttack = true;
      } else {
        this.allowAttack = false;
      }
    }

    switch (id) {
      case 0:
        this.keyboardUp = 38;
        this.keyboardLeft = 37;
        this.keyboardRight = 39;
        this.keyboardDown = 40;
        break;
      case 1:
        this.keyboardUp = 87;
        this.keyboardLeft = 65;
        this.keyboardRight = 68;
        this.keyboardDown = 83;
        break;
    }

}

var palyerNumber = {
  "user": 0,
  "AI": 0
}

function buildPlayers(amount, AIamount, status){
  if(amount <= 2 && AIamount <= 3){
    for(var i = 0; i < (amount + AIamount); i++){
      var ai;
      if(i >= amount){
        ai = true;
      }
      players[i] = new player(i, ai);
    }
    return status(null, true);
  } else {
    return status("Maximun players number is two");
  }

  return players;
}
