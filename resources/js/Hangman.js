class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  start(difficulty, next) {
    // gets the word
    this.word = this.getRandomWord(difficulty);
  
    this.clearCanvas();
    this.drawBase();

    // rests the guesses
    this.guess = [];
    //resets the .isOver
    this.isOver = false;
    //resets .didWin
    this.didWin = false;

    next;
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    this.letter = letter;
    // Checks if nothing was provided and throw an error if so
    if (letter == null){
      console.error("Please fill in a letter");
    }
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    if (letter.length !== 1 && letter.match(/[a-z]/)){
      console.error("Please make sure you are entering a letter")
    }
    // Check if more than one letter was provided. throw an error if it is.
    if(letter.length !== 1){
      console.error("Please enter one letter at a time");
    }
    // if it's a letter, convert it to lower case for consistency.
    if (letter.length === 1 && letter.match(/[a-z]/)){
      return letter.toLocaleLowerCase();
    }
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    if(this.guess.includes(letter)){
      this.guess.push(letter);
    }
    else{
      throw new Error("You already guessed this letter. Try again.");
    }
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    if(this.word.includes(letter)){
      this.checkWin();
    }
    else{
      this.onWrongGuess();
    }

    
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
    let unknownLetter =
      this.word.split('').filter(words => !this.guess(includes(words))).length;
    console.log(unknownLetter);

    if (unknownLetter == 0){
      this.didWin = true;
      this.isOver = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    const wrongGuess = this.guess.filter(letter => !this.word.includes(letter)).length;

    if(wrongGuess == 1){
      this.drawHead();
    }
    if(wrongGuess == 2){
      this.drawBody();
    }
    if(wrongGuess == 3){
      this.drawRightArm();
    }
    if(wrongGuess == 4){
      this.drawLeftArm();
    }
    if(wrongGuess == 5){
      this.drawRightLeg();
    }
    if(wrongGuess == 6){
      this.drawLeftLeg();
      this.isOver = true;
      this.didWin = false;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    return this.word.split('')
    .map(letter => this.guess.includes(letter) ? letter : "_")
    .join();
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return `Guesses: ${this.guess.join(', ')}`;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(250, 85, 25, 0, Math.PI*2, false);
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.fillRect(245, 110, 10, 80, false);
  }

  drawLeftArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 175);
    this.ctx.lineTo(170, 100);
    this.ctx.stroke();
  }

  drawRightArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 175);
    this.ctx.lineTo(300, 100);
    this.ctx.stroke();
  }

  drawLeftLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(245, 190);
    this.ctx.lineTo(170, 250);
    this.ctx.stroke();
  }

  drawRightLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(255, 190);
    this.ctx.lineTo(330, 250);
    this.ctx.stroke();
  }

  
}
