function renderEntity(entity) {
  ctx.save();
  ctx.translate(entity.pos[0], entity.pos[1]);
  entity.animation.render(ctx);
  ctx.restore();
}

const angles = [0, 180, 90, 270];
function drawImage(angles_index, img, x, y) {
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.rotate(angles[angles_index]*Math.PI/180);
	ctx.drawImage(img, x, y);
	ctx.restore();
}

const lifes_images = [{"image": tinImage, "x": -80, "y": 350},
											{"image": hanImage, "x": -25, "y": 350},
											{"image": taImage, "x": -80, "y": 390},
											{"image": pinImage, "x": -25, "y": 390}];

var displayGameImageObject = function (dt) {
	//draw backgorund
	ctx.fillStyle = backgroundPattern;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(!isGameOver) {
    for(let i = 0; i < players.length; i++){
      let index = Math.ceil(i/3);
      if(players[i].alive){
         informationBar(i);
      }
      for (let lifes = 0; lifes < players[i].life; lifes++) {
        drawImage(i, lifes_images[lifes].image,
                  lifes_images[lifes].x+index*52,
                  lifes_images[lifes].y+index*20);
      }
      if(players[i].potect > 0){
        drawImage(i, castleImage, -110+index*52, 310+index*15);
      }
      if(players[i].flag > 0 && players[i].flag < 4){
        for(let a = 0; a < players[i].flag; a++){
          renderEntity(players_flags[i][a]);
          players_flags[i][a].animation.update(dt);
        }
      }
      if (players[i].plane > 0) {
        renderEntity(players_plane[i]);
        players_plane[i].animation.update(dt);
      }
    }
	}

}
