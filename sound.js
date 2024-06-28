class AudioControl{
    constructor(){
        this.bite1 = document.getElementById('bite1')
        this.bite2 = document.getElementById('bite2')
        this.bite3 = document.getElementById('bite3')
        this.bite4 = document.getElementById('bite4')
        this.bite5 = document.getElementById('bite5')

        this.biteSounds = [this.bite1, this.bite2, this.bite3, this.bite4, this.bite5];

        this.badFood = document.getElementById("badFood");
        this.startSound = document.getElementById("startSound");
        this.restartSound = document.getElementById("restartSound");
        this.restartSound = document.getElementById("restartSound");
        this.win = document.getElementById("win");
        this.button = document.getElementById("button");
    }
    play(sound){
        sound.currentTime = 0
        sound.play()
    }
}