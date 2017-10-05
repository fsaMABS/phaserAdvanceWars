for (var i = 0; i < this.textChoice.length; i++) {
  this.textArray[i] = this.game.add.text(
    this.game.world.centerX,
    150 + i * 20,
    this.textChoice[i].text
  );
  this.textArray[i].name = "text" + i;
  this.textArray[i].inputEnabled = true;
  this.textArray[i].events.onInputDown.add(this.dialogueNext, this);
}
function dialogueNext(text, pointer) {
  if (text.name === "text1") {
  }
}
