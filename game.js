

//================================== Part One - Variable Declaration ==================================//


//@var grid: a 10*10 array representing the 10*10 game keyboard
var board =     [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

//@var table: The html object that represent the game keyboard
var Table = document.getElementById("table")

//@GameStage: a string representing game stage and will be used by function "Click", default "setup" stage
var GameStage = "setup"

//Define the existence and position of asteroids being input
var AsteroidExists = false
var AsteroidX = 0
var AsteroidY = 0
var CountAsteroid = 0

//Define the existence and position of mines being input
var MineExists = false
var MineX = 0
var MineY = 0
var CountMine = 0

//Count the number of activated mines
var CountActivatedMine = 0

//Define the existence and position of robotic spaceships being input
var RoboticSpaceshipExists = false
var RoboticSpaceshipX = 0
var RoboticSpaceshipY = 0
var CountRoboticSpaceship = 0
var RoboticSpaceshipPosition = []

//Define the existence and position of the user spaceship being input
var UserSpaceshipExists = false
var UserSpaceshipX = 0
var UserSpaceshipY = 0

//@Round: game round count
var Round = 0

//@MinePosition: All nearby mine's position when the robotic spaceship approaches
var MinePosition = []

var EndStage = false


//================================== Part Two - Table Creation, Click Response ==================================//


CreateTable(Table)

/**
 * To restart game
 */
function Restart() {
    window.location.reload();
}

/**
 * To create the table
 * @param table: The html object that represent the game keyboard
 */
function CreateTable(table) {
    //Create table by for loops
    for (var y = 0; y < board.length; y++) {
        var tr = document.createElement("tr")
        table.appendChild(tr)
        for (var x = 0; x < board[y].length; x++) {
            var td = document.createElement("td")
            var txt = document.createTextNode(" ")
            td.appendChild(txt)
            //Add click monitor to each cell of the table, send info to Click()
            td.addEventListener("click", Click.bind(null, x, y), false)
            tr.appendChild(td)
        }
    }
}

/**
 * To clear message on the website
 * @param id - the HTML element id to clear message
 */
function ClearMessage(id) {
        m1 = document.getElementById(id);
        m1.style.display = "none";
}

/**
 * To show message on the website
 * @param id - the HTML element id to show message
 * @param message - message content
 * @param style - message (css) style
 */
function ShowMessage(id, message, style) {
        var m1 = document.getElementById(id);
        m1.innerHTML = message;
        m1.style.display = "block";
        m1.className = style;
}

/**
 * To define which stage the game is in by monitoring user's clicking behaviour
 * All parameter values come from function "create table" - "addEventListener"
 * @param x - x-axis coordinate of the sell
 * @param y - y-axis coordinate of the sell
 * @param event - event triggered (from clicking)
 */
function Click(x, y, event) {
    switch (GameStage) {
        case "setup":
            SetUp(x, y, event)
            break;
        case "play":
            break;
        case "end":
            break;
    }
}


//================================== Part Three - SetUp Stage ==================================//


/**
 * The playable setup stage of the game
 * @param x - x-axis coordinate of the cell that user places an object in
 * @param y - y-axis coordinate of the cell that user places an object in
 * @param event - event triggered (from clicking)
 */
function SetUp(x, y, event) {
    //debugger
    console.log("x = "+x+" y = "+y);
    console.log("b = "+board[y][x]);
    ShowMessage("status","Status: <br>" +
        "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
        "Mines placed: "+CountMine)

    //Monitor keyboard
    document.onkeydown=function(event){

        //If user press key "A" - Place an asteroid
        if(event.keyCode===65){
            //Check if the cell were occupied
            if (board[y][x] === 0){
                AsteroidExists = true
                AsteroidX = x
                AsteroidY = y
                CountAsteroid++
                Table.rows[y].cells[x].innerHTML = "<img id='Asteroid' src = img/Asteroid.png>" //render the board
                board[y][x] = "Asteroid" //change the board
            }
            else {
                ShowMessage("message1","Position ["+x+","+y+"] already occupied !")
            }
        }

        //If user press key "M" - Place a mine
        if(event.keyCode===77){
            if (board[y][x] === 0){
                MineExists = true
                MineX = x
                MineY= y
                CountMine++
                Table.rows[y].cells[x].innerHTML = "<img id='Mine' src = img/Mine.png>"
                board[y][x] = "Mine"
            }
            else {
                ShowMessage("message1","Position ["+x+","+y+"] already occupied !")
            }
        }

        //If user press key "R" - Place a robotic spaceship
        if(event.keyCode===82){
            if (board[y][x] === 0){
                RoboticSpaceshipExists = true
                RoboticSpaceshipX = x
                RoboticSpaceshipY= y
                CountRoboticSpaceship++
                Table.rows[y].cells[x].innerHTML = "<img id='RoboticSpaceship' src = img/RoboticSpaceship.png>"
                board[y][x] = "RoboticSpaceship"
                RoboticSpaceshipPosition.push([x, y]) //record all robotic spaceship position to an array
            }
            else {
                ShowMessage("message1","Position ["+x+","+y+"] already occupied !")
            }
        }

        //If user press key "U" - Place a user spaceship
        if(event.keyCode===85) {
            if (board[y][x] === 0){
                //User can only place on user spaceship
                if (!UserSpaceshipExists){
                    UserSpaceshipExists = true
                    UserSpaceshipX = x
                    UserSpaceshipY = y
                    Table.rows[y].cells[x].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
                    board[y][x] = "UserSpaceship"
                }
                else {
                    alert("You can only own one spaceship!")
                }
            }
            else{
                ShowMessage("message1","Position ["+x+","+y+"] already occupied !")
            }
        }

        //If user press other keys, error reminder message shown
        if (event.keyCode!==65 && event.keyCode!==77 && event.keyCode!==82 && event.keyCode!==85){
            ShowMessage("message1", "Invalid key pressed!")
        }
    }

    //Clear the messages display to start the next round of selection
    ShowMessage("message1","")
    ShowMessage("message2","")

    //debugger
    console.log(board)

}

//================================== Part Four - Play Stage, The User's Attempt & KeyBoard Response ==================================//

/**
 * When press "End Setup" button, switch from setup stage to play stage
 */
function Play(){
    //debugger
    console.log("board: "+board)
    //start playing condition
    if (!UserSpaceshipExists) {
        alert('Place your own spaceship to start the game!')
        SetUp() //no user spaceship placed - back to the setup page
    }
    if (EndStage===true){
        alert('Press restart the start new game!') //if user click "End Setup" button in the end stage
    }
    //end playing condition
    if (CountRoboticSpaceship===0 || CountMine===0){
        End()
    }
    //start play stage
    else{
        Round++
        GameStage = "play"
        //Show play stage UI contents
        PlayStageInfo()

        //User's turn in the round
        document.onkeydown=function(event) {
            e = event || window.event || arguments.callee.caller.arguments[0];

            //If the game is in end stage, force to cancel the keyboard event
            if (EndStage===true){
                e = null
                event = null
            }

            //Press "w"
            if (e && e.keyCode === 87) {

                //if user's move reaches to the top edge
                if (UserSpaceshipY === 0) {
                    //User's spaceship do not move, and user's turn is over
                    alert("Your spaceship have reached the top!")
                    ComputerPlay()
                }

                //if exist asteroid on the top cell that blocks user's move
                else if (UserBlockedByAsteroid("w")){
                    //User's spaceship do not move, and user's turn is over
                    alert("Move failed, an asteroid has blocked your spaceship!")
                    ComputerPlay()
                }

                //if user's move reaches an unactivated mine
                //The implementation includes both changing images and activate mines
                else if (UserReachesMine("w")){
                    //Case 1 - User moves from empty cell to an unactivated mine
                    //Original cell's image changes from "UserSpaceship" to empty
                    //Newly-Reached cell's image changes from "Mine" to "UserSpaceshipHitsMine"
                    if (UserLeavesEmpty()){
                        EmptyToMine("w") //User's spaceship moves
                        ActivateMine()
                        ComputerPlay() //Computer's turn
                    }
                    //Case 2 - User moves from an activated mine to another unactivated mine
                    //Original cell's image changes from "UserSpaceshipHitsMine" to "ActivatedMine"
                    //Newly-Reached cell's image changes from "Mine" to "UserSpaceshipHitsMine"
                    else if (UserLeavesMine()){
                        MineToMine("w") //User's spaceship moves
                        ActivateMine()
                        ComputerPlay() //User's spaceship moves
                    }
                }

                //if user's move reaches an activated mine
                //This implementation only requires changing images
                else if (UserReachesActivatedMine("w")){
                    //Case 3 - User moves from empty cell to an activated mine
                    //Original cell's image changes from "UserSpaceship" to empty
                    //Newly-Reached cell's image changes from "ActivatedMine" to "UserSpaceshipHitsMine"
                    if (UserLeavesEmpty()){
                        EmptyToMine("w")
                        ComputerPlay()
                    }
                    //Case 4 - User moves from an activated mine to another activated mine
                    //Original cell's image changes from "UserSpaceshipHitsMine" to "ActivatedMine"
                    //Newly-Reached cell's image changes from "ActivatedMine" to "UserSpaceshipHitsMine"
                    else if (UserLeavesMine()){
                        MineToMine("w")
                        ComputerPlay()
                    }
                }

                //if user's move reaches a robotic spaceship
                //This implementation requires changing images and ending the game
                else if (UserReachesRoboticSpaceship("w")){
                    //Case 5 - User moves from empty cell to a robotic spaceship
                    //Original cell's image changes from "UserSpaceship" to empty
                    //Newly-Reached cell's image changes from "RoboticSpaceship" to "UserSpaceshipDestroyed"
                    if (UserLeavesEmpty()){
                        UserHitsFromEmpty("w")
                        UserSpaceshipExists = false
                        End()
                    }
                    //Case 6 - User moves from a mine to a robotic spaceship
                    //Original cell's image changes from "UserSpaceshipHitsMine" to "Mine"
                    //Newly-Reached cell's image changes from "RoboticSpaceship" to "UserSpaceshipDestroyed"
                    else if (UserLeavesMine()){
                        UserHitsFromMine("w")
                        UserSpaceshipExists = false
                        End()
                    }
                }

                //if user's move reaches an empty cell
                //This implementation only requires changing images
                else{
                    //Case 7 - User moves from an empty cell to another empty cell
                    //Original cell's image changes from "UserSpaceship" to empty
                    //Newly-Reached cell's image changes from empty to "UserSpaceship"
                    if (UserLeavesEmpty()){
                        EmptyToEmpty("w")
                        ComputerPlay()
                    }
                    //Case 8 - User moves from an activated mine to an empty cell
                    //Original cell's image changes from "UserSpaceshipHitsMine" to "ActivatedMine"
                    //Newly-Reached cell's image changes from empty to "UserSpaceship"
                    else if (UserLeavesMine()){
                        MineToEmpty("w")
                        ComputerPlay()
                    }
                }

            }

            //Press "a" (Similar operations as above, see the example of pressing "w" for concrete logical descriptions)
            if (e && e.keyCode === 65) {
                if (UserSpaceshipX === 0) {
                    alert("Your spaceship have reached the left edge!")
                    ComputerPlay()
                }
                else if (UserBlockedByAsteroid("a")){
                    alert("Move failed, an asteroid has blocked your spaceship!")
                    ComputerPlay()
                }
                else if (UserReachesMine("a")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("a")
                        ActivateMine()
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("a")
                        ActivateMine()
                        ComputerPlay()
                    }
                }
                else if (UserReachesActivatedMine("a")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("a")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("a")
                        ComputerPlay()
                    }
                }
                else if (UserReachesRoboticSpaceship("a")){
                    if (UserLeavesEmpty()){
                        UserHitsFromEmpty("a")
                        UserSpaceshipExists = false
                        End()
                    }
                    else if (UserLeavesMine()){
                        UserHitsFromMine("a")
                        UserSpaceshipExists = false
                        End()
                    }
                }
                else{
                    if (UserLeavesEmpty()){
                        EmptyToEmpty("a")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToEmpty("a")
                        ComputerPlay()
                    }
                }
            }

            //Press "s" (Similar operations)
            if (e && e.keyCode === 83) {
                if (UserSpaceshipY === 9) {
                    alert("Your spaceship have reached the bottom!")
                }
                else if (UserBlockedByAsteroid("s")){
                    alert("Move failed, an asteroid has blocked your spaceship!")
                    ComputerPlay()
                }
                else if (UserReachesMine("s")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("s")
                        ActivateMine()
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("s")
                        ActivateMine()
                        ComputerPlay()
                    }
                }
                else if (UserReachesActivatedMine("s")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("s")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("s")
                        ComputerPlay()
                    }
                }
                else if (UserReachesRoboticSpaceship("s")){
                    if (UserLeavesEmpty()){
                        UserHitsFromEmpty("s")
                        UserSpaceshipExists = false
                        End()
                    }
                    else if (UserLeavesMine()){
                        UserHitsFromMine("s")
                        UserSpaceshipExists = false
                        End()
                    }
                }
                else{
                    if (UserLeavesEmpty()){
                        EmptyToEmpty("s")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToEmpty("s")
                        ComputerPlay()
                    }
                }
            }

            //Press "d"
            if (e && e.keyCode === 68) {
                if (UserSpaceshipX === 9) {
                    alert("Your spaceship have reached the right edge!")
                }
                else if (UserBlockedByAsteroid("d")){
                    alert("Move failed, an asteroid has blocked your spaceship!")
                    ComputerPlay()
                }
                else if (UserReachesMine("d")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("d")
                        ActivateMine()
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("d")
                        ActivateMine()
                        ComputerPlay()
                    }
                }
                else if (UserReachesActivatedMine("d")){
                    if (UserLeavesEmpty()){
                        EmptyToMine("d")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToMine("d")
                        ComputerPlay()
                    }
                }
                else if (UserReachesRoboticSpaceship("d")){
                    if (UserLeavesEmpty()){
                        UserHitsFromEmpty("d")
                        UserSpaceshipExists = false
                        End()
                    }
                    else if (UserLeavesMine()){
                        UserHitsFromMine("d")
                        UserSpaceshipExists = false
                        End()
                    }
                }
                else{
                    if (UserLeavesEmpty()){
                        EmptyToEmpty("d")
                        ComputerPlay()
                    }
                    else if (UserLeavesMine()){
                        MineToEmpty("d")
                        ComputerPlay()
                    }
                }
            }

            //If user press other keys, error reminder message shown
            if (event.keyCode!==87 && event.keyCode!==65 && event.keyCode!==83 && event.keyCode!==68){
                alert("Invalid key pressed!")
            }
        }
    }
}

/**
 * To display play stage UI
 * called by function Play()
 */
function PlayStageInfo(){
    //left column info
    ClearMessage("introduction")
    ShowMessage("introduction","Rules")
    ClearMessage("introContent0")
    ClearMessage("introContent1")
    ClearMessage("introContent2")
    ClearMessage("introContent3")
    ClearMessage("introContent4")
    ClearMessage("introContent5")
    ClearMessage("Asteroid")
    ClearMessage("Mine")
    ClearMessage("RoboticSpaceship")
    ClearMessage("UserSpaceship")
    ShowMessage("stageHeader","Play Stage")
    ShowMessage("introContent1", "Press keys to move your spaceship!")
    ShowMessage("introContent2","W - Move Upwards<br> A - Move Leftwards<br> " +
        "S - Move Downwards<br> D - Move Rightwards<br>")
    ShowMessage("introContent3","Control your spaceship to activate mines<br> " +
        "<img id='Mine' src=img/Mine.png> " +
        "<img id='Arrow' src=img/Arrow.png> " +
        "<img id='ActivatedMine' src=img/ActivatedMine.png><br>" +
        "Robotic Spaceship will hunt and your mine and your spaceship<br>"+
        "<img id='RoboticSpaceshipHuntMine' src=img/RoboticSpaceshipHuntMine.png>"+
        "<img id='RoboticSpaceshipHuntUserSpaceship' src = img/RoboticSpaceshipHuntUserSpaceship.png><br>"+
        "Activated mines can destroy robotic spaceships <br> " +
        "<img id='ActivatedMine' src=img/ActivatedMine.png>" +
        "<img id='DefeatRoboticSpaceship' src=img/DefeatRoboticSpaceship.png><br><br>" +
        "Avoid crashing to or being hunted by robotic spaceships,<br>" +
        "and defeat them to win the game!<br>")
    ShowMessage("introContent5","Good Luck!")

    //right column info
    ShowMessage("message1","Round: "+Round)
    ShowMessage("status","Status: <br>" +
        "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
        "Mines inactivated: "+CountMine+"<br>"+
        "Mines activated: "+CountActivatedMine+"<br>")
}

/**
 * To check if the direction that a user want its spaceship to move has blocked by an asteroid
 * @param direction - the key that user pressed, received from function play()
 */
function UserBlockedByAsteroid(direction){
    if (direction==="w"){
        //if being blocked from the top
        if (board[UserSpaceshipY-1][UserSpaceshipX] === "Asteroid"){
            return true
        }
    }
    else if (direction==="a"){
        if (board[UserSpaceshipY][UserSpaceshipX-1] === "Asteroid"){
            return true
        }
    }
    else if (direction==="s"){
        if (board[UserSpaceshipY+1][UserSpaceshipX] === "Asteroid"){
            return true
        }
    }
    else if (direction==="d"){
        if (board[UserSpaceshipY][UserSpaceshipX+1] === "Asteroid"){
            return true
        }
    }
}

/**
 * To check if the direction that a user wants its spaceship to move has an unactivated mine besides
 * @param direction - the key that user pressed, received from function play()
 */
function UserReachesMine(direction){
    if (direction==="w"){
        //if being blocked from the top
        if (board[UserSpaceshipY-1][UserSpaceshipX] === "Mine"){
            return true
        }
    }
    else if (direction==="a"){
        if (board[UserSpaceshipY][UserSpaceshipX-1] === "Mine"){
            return true
        }
    }
    else if (direction==="s"){
        if (board[UserSpaceshipY+1][UserSpaceshipX] === "Mine"){
            return true
        }
    }
    else if (direction==="d"){
        if (board[UserSpaceshipY][UserSpaceshipX+1] === "Mine"){
            return true
        }
    }
}

/**
 * To check if the direction that a user wants its spaceship to move has an activated mine besides
 * @param direction - the key that user pressed, received from function play()
 */
function UserReachesActivatedMine(direction){
    if (direction==="w"){
        //if being blocked from the top
        if (board[UserSpaceshipY-1][UserSpaceshipX] === "ActivatedMine"){
            return true
        }
    }
    else if (direction==="a"){
        if (board[UserSpaceshipY][UserSpaceshipX-1] === "ActivatedMine"){
            return true
        }
    }
    else if (direction==="s"){
        if (board[UserSpaceshipY+1][UserSpaceshipX] === "ActivatedMine"){
            return true
        }
    }
    else if (direction==="d"){
        if (board[UserSpaceshipY][UserSpaceshipX+1] === "ActivatedMine"){
            return true
        }
    }
}

/**
 * To check if the direction that a user wants its spaceship to move has a robotic spaceship besides
 * @param direction - the key that user pressed, received from function play()
 */
function UserReachesRoboticSpaceship(direction){
    if (direction==="w"){
        //if being blocked from the top
        if (board[UserSpaceshipY-1][UserSpaceshipX] === "RoboticSpaceship"){
            return true
        }
    }
    else if (direction==="a"){
        if (board[UserSpaceshipY][UserSpaceshipX-1] === "RoboticSpaceship"){
            return true
        }
    }
    else if (direction==="s"){
        if (board[UserSpaceshipY+1][UserSpaceshipX] === "RoboticSpaceship"){
            return true
        }
    }
    else if (direction==="d"){
        if (board[UserSpaceshipY][UserSpaceshipX+1] === "RoboticSpaceship"){
            return true
        }
    }
}

/**
 * To check if user's spaceship is leaving an empty cell
 */
function UserLeavesEmpty(){
    if (board[UserSpaceshipY][UserSpaceshipX] === "UserSpaceship"){
        return true
    }
}

/**
 * To check if user's spaceship is leaving an activated mine
 */
function UserLeavesMine(){
    if (board[UserSpaceshipY][UserSpaceshipX] === "UserSpaceshipHitsMine"){
        return true
    }
}

/**
 * To implement the activation of a mine
 * Only called when the move of user's spaceship reaches an unactivated mine
 */
function ActivateMine(){
    CountMine--
    CountActivatedMine++
    ShowMessage("status","Status: <br>" +
        "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
        "Mines inactivated: "+CountMine+"<br>"+
        "Mines activated: "+CountActivatedMine+"<br>")

    //if user's this attempt has results in no unactivated mine left in the board, end the game
    if (CountMine===0){
        End()
    }
}

/**
 * In the case that user moves from an empty cell to an empty cell
 * To implement the actual move of the user spaceship
 * Change images display and update the position of the user's spaceship
 * Newly-reached cell's image - [from empty to "UserSpaceship"]
 * Original cell's image - [from "UserSpaceship" to empty]
 * @param direction - the key that user pressed, received from function play()
 */
function EmptyToEmpty(direction){
    // user press w, spaceship should move to the cell upward
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceship"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        //Clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceship"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceship"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceship"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX++
    }
}

/**
 * In the case that user moves from an empty cell to an unactivated or activated mine (same images change in these two circumstances)
 * To implement the actual move of the user spaceship
 * Change images display and update the position of the user's spaceship
 * Newly-reached cell's image - [from "Mine" to "UserSpaceshipHitsMine"]
 * Original cell's image - [from "UserSpaceship" to empty]
 * @param direction - the key that user pressed, received from function play()
 */
function EmptyToMine(direction){
    // user press w, spaceship should move to the cell upward to activate the mine
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        //clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX++
    }
}

/**
 * In the case that user moves from an activated mine to an unactivated or activated mine (same images change in these two circumstances)
 * To implement the actual move of the user spaceship
 * Change images display and update the position of the user's spaceship
 * Newly-reached cell's image - [from "Mine" to "UserSpaceshipHitsMine"]
 * Original cell's image - [from "UserSpaceshipHitsMine" to "ActivatedMine"]
 * @param direction - the key that user pressed, received from function play()
 */
function MineToMine(direction){
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        //clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceshipHitsMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceshipHitsMine' src = img/UserSpaceshipHitsMine.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX++
    }
}

/**
 * In the case that user moves from an empty cell to an unactivated mine
 * To implement the actual move of the user spaceship
 * Change images display and update the position of the user's spaceship
 * Newly-reached cell's image - [from empty to "UserSpaceship"]
 * Original cell's image - [from "UserSpaceshipHitsMine" to "ActivatedMine"]
 * @param direction - the key that user pressed, received from function play()
 */
function MineToEmpty(direction){
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceship"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        //clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceship"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceship"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceship"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceship' src = img/UserSpaceship.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX++
    }
}

/**
 * In the case that user hit robotic spaceship from an empty cell
 * Change images display
 * Newly-reached cell's image - [from "RoboticSpaceship" to "UserSpaceshipDestroyed"]
 * Original cell's image - [from "UserSpaceship" to "Empty"]
 * @param direction - the key that user pressed, received from function play()
 */
function UserHitsFromEmpty(direction){
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        //clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = 0
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "";
        UserSpaceshipX++
    }
}

/**
 * In the case that user hit robotic spaceship from a mine
 * Change images display
 * Newly-reached cell's image - [from "RoboticSpaceship" to "UserSpaceshipDestroyed"]
 * Original cell's image - [from "UserSpaceshipHitsMine" to "Mine"]
 * @param direction - the key that user pressed, received from function play()
 */
function UserHitsFromMine(direction){
    if (direction==="w"){
        //update the value of the new cell and render new table
        board[UserSpaceshipY-1][UserSpaceshipX] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY-1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        //clear the value of the original cell and render new table
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        //update the new position of the user spaceship
        UserSpaceshipY--
    }
    else if (direction==="a"){
        board[UserSpaceshipY][UserSpaceshipX-1] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX-1].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX--
    }
    else if (direction==="s"){
        board[UserSpaceshipY+1][UserSpaceshipX] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY+1].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipY++
    }
    else if (direction==="d"){
        board[UserSpaceshipY][UserSpaceshipX+1] = "UserSpaceshipDestroyed"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX+1].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"
        board[UserSpaceshipY][UserSpaceshipX] = "ActivatedMine"
        Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='ActivatedMine' src = img/ActivatedMine.png>";
        UserSpaceshipX++
    }
}


//================================== Part Five - Play Stage, The Computer's Attempt ==================================//


/**
 * To achieve the computer's move of every robotic spaceships on the board
 * only called when user's turn is over
 */
function ComputerPlay(){
    //Need a for loop to multiply every robotic spaceships
    //Every robotic spaceship's position is stored in a two-dimensional array - @var:RoboticSpaceshipPosition
    for (let i = 0; i < CountRoboticSpaceship; i++) {
        var RoboticSpaceship = RoboticSpaceshipPosition[i] //Manipulate one robotic spaceship
        var x = RoboticSpaceship[0]
        var y = RoboticSpaceship[1]

        //If robotic spaceship is on a cell that surrounding the user's spaceship,
        //then that robotic spaceship moves to destroy the user's spaceship
        if (RoboticSpaceshipNearUser(x, y)){
            RoboticSpaceshipHuntsUser(x, y)
            //End game and User loses
            UserSpaceshipExists = false
            End()
        }

        //Under the circumstances that user's spaceship is not in the surrounding area
        else{

            //If the robotic spaceship is on a cell that surrounding an unactivated mine,
            //then the robotic spaceship moves to one of an unactivated mine and destroy that mine
            if (RoboticSpaceshipNearMine(x, y)){
                //Array "MinePosition" stores positions of all the mines detected in function RoboticSpaceshipNearMine()
                //select a random position in the array "MinePosition" as target mine
                var j = getRandomNumber(1,MinePosition.length)
                var RandomMine = MinePosition[j-1]
                //Now, the random target mine's position is stored in one-dimensional array "RandomMine"
                //then execute the hunt
                RoboticSpaceshipHuntsMine(x, y, i, RandomMine[0], RandomMine[1])
                //if computer's this move results in no unactivated mine left in the board, end game
                if (CountMine===0){
                    End()
                }
            }

            //Otherwise, there's no compulsory action of the robotic spaceship
            //The robotic spaceship can move arbitrarily
            else{
                RoboticSpaceshipRandomMove(x,y,i)
            }
        }
    }

    //After computer moving every robotic spaceship, This whole turn is over
    Round++
    //Show the Round status
    ShowMessage("message1","Round: "+Round)
}

/**
 * To check if the robotic spaceship is near the user's spaceship and satisfy the condition to hunt user's spaceship
 * If yes, return true
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 */
function RoboticSpaceshipNearUser(x,y){
    //Robotic spaceship is located in just one row over the user's spaceship
    if (y+1===UserSpaceshipY){
        if (x+1===UserSpaceshipX){
            return true //Robotic spaceship is on the top-left cell besides the user's spaceship
        }
        else if (x===UserSpaceshipX){
            return true //Robotic spaceship is on the top cell besides the user's spaceship
        }
        else if (x-1===UserSpaceshipX){
            return true //Robotic spaceship is on the top-right cell besides the user's spaceship
        }
    }
    //Robotic spaceship is located in exactly the row of the user's spaceship
    if (y===UserSpaceshipY){
        if (x+1===UserSpaceshipX){
            return true //Robotic spaceship is on the left cell besides the user's spaceship
        }
        else if (x-1===UserSpaceshipX){
            return true //Robotic spaceship is on teh right cell besides the user's spaceship
        }
    }
    // Robotic spaceship is located in just one row beneath the user's spaceship
    if (y-1===UserSpaceshipY){
        if (x+1===UserSpaceshipX){
            return true //Robotic spaceship is on the bottom-left cell besides the user's spaceship
        }
        else if (x===UserSpaceshipX){
            return true //Robotic spaceship is on the bottom cell besides the user's spaceship
        }
        else if (x-1===UserSpaceshipX){
            return true //Robotic spaceship is on the bottom-right cell besides the user's spaceship
        }
    }
}

/**
 * To check if the robotic spaceship is near an unactivated mine
 * If yes, return true
 * As we do not want the board index to go out of boundary, the index range of x and y is strictly limited
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 */
function RoboticSpaceshipNearMine(x,y){
    if (y<9){
        if (x<9){
            if (board[y+1][x+1] === "Mine"){
                //Robotic spaceship is on the top-left cell besides the mine
                MinePosition.push([x+1,y+1]) //Record
                return true
            }
        }
        if (board[y+1][x] === "Mine") {
            //Robotic spaceship is on the top cell besides the mine
            MinePosition.push([x,y+1]) //Record
            return true
        }
        if (x>0){
            if (board[y+1][x-1] === "Mine") {
                //Robotic spaceship is on the top-right cell besides the mine
                MinePosition.push([x-1,y+1]) //Record
                return true
            }
        }
    }

    if (x<9){
        if (board[y][x+1] === "Mine") {
            //Robotic spaceship is on the left cell besides the mine
            MinePosition.push([x+1,y]) //Record
            return true
        }
    }
    if (x>0){
        if (board[y][x-1] === "Mine") {
            //Robotic spaceship is on teh right cell besides the mine
            MinePosition.push([x-1,y]) //Record
            return true
        }
    }

    if (y>0){
        if (x<9){
            if (board[y-1][x+1] === "Mine") {
                //Robotic spaceship is on the bottom-left cell besides the mine
                MinePosition.push([x+1,y-1]) //Record
                return true
            }
        }
        if (board[y-1][x] === "Mine") {
            //Robotic spaceship is on the bottom cell besides the mine
            MinePosition.push([x,y-1]) //Record
            return true
        }
        if (x>0){
            if (board[y-1][x-1] === "Mine") {
                //Robotic spaceship is on the bottom-right cell besides the mine
                MinePosition.push([x-1,y-1]) //Record
                return true
            }
        }
    }
}

/**
 * To check if the robotic spaceship is near an activated mine
 * If yes, return true
 * As we do not want the board index to go out of boundary, the index range of x and y is strictly limited
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 */
function RoboticSpaceshipNearActivatedMine(x,y){
    if (y<9){
        if (x<9){
            if (board[y+1][x+1] === "ActivatedMine"||
                board[y+1][x+1] === "UserSpaceshipHitsMine"){
                //Robotic spaceship is on the top-left cell besides the activated mine
                return true
            }
        }
        if (board[y+1][x] === "ActivatedMine"||
            board[y+1][x] === "UserSpaceshipHitsMine") {
            //Robotic spaceship is on the top cell besides the activated mine
            return true
        }
        if (x>0){
            if (board[y+1][x-1] === "ActivatedMine"||
                board[y+1][x-1] === "UserSpaceshipHitsMine") {
                //Robotic spaceship is on the top-right cell besides the activated mine
                return true
            }
        }
    }

    if (x<9){
        if (board[y][x+1] === "ActivatedMine"||
            board[y][x+1] === "UserSpaceshipHitsMine") {
            //Robotic spaceship is on the left cell besides the activated mine
            return true
        }
    }
    if (x>0){
        if (board[y][x-1] === "ActivatedMine"||
            board[y][x-1] === "UserSpaceshipHitsMine") {
            //Robotic spaceship is on teh right cell besides the activated mine
            return true
        }
    }

    if (y>0){
        if (x<9){
            if (board[y-1][x+1] === "ActivatedMine"||
                board[y-1][x+1] === "UserSpaceshipHitsMine") {
                //Robotic spaceship is on the bottom-left cell besides the activated mine
                return true
            }
        }
        if (board[y-1][x] === "ActivatedMine"||
            board[y-1][x] === "UserSpaceshipHitsMine") {
            //Robotic spaceship is on the bottom cell besides the activated mine
            return true
        }
        if (x>0){
            if (board[y-1][x-1] === "ActivatedMine"||
                board[y-1][x-1] === "UserSpaceshipHitsMine") {
                //Robotic spaceship is on the bottom-right cell besides the activated mine
                return true
            }
        }
    }
}

/**
 * To generate a random number between range min (@param n) and max (@param m)
 * @param n - The min of the random number's range
 * @param m - The max of the random number's range
 */
function getRandomNumber(n, m) {
    n = Number(n)
    m = Number(m)
    if (n > m) {
        var temp
        temp = n
        n = m
        m = temp
    }
    return Math.round(Math.random() * (m - n) + n)
}

/**
 * Operate the move for robotic spaceship to hunt the user's spaceship
 * Only called if robotic spaceship is near user's spaceship
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 */
function RoboticSpaceshipHuntsUser(x,y){
    //update the value of the new cell (i.e. the current cell of the user's spaceship) and render new table
    board[UserSpaceshipY][UserSpaceshipX] = "UserSpaceshipDestroyed"
    Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='UserSpaceshipDestroyed' src = img/UserSpaceshipDestroyed.png>"

    //clear the value of the original cell and render new table
    board[y][x] = 0
    Table.rows[y].cells[x].innerHTML = "";

    //Update the number of spaceships exist in board and show message
    CountRoboticSpaceship--
    ShowMessage("status","Status: <br>" +
        "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
        "Mines inactivated: "+CountMine+"<br>"+
        "Mines activated: "+CountActivatedMine+"<br>")
}

/**
 * Operate the move for robotic spaceship to hunt the mine
 * Only called if robotic spaceship is near a mine / many mines
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 * @param i - The ith robotic spaceship in the array "RoboticSpaceshipPosition" is moving
 * @param MineX - The x coordinate of the selected mine
 * @param MineY - The y coordinate of the selected mine
 */
function RoboticSpaceshipHuntsMine(x,y,i,MineX,MineY){
    //update the value of the new cell (i.e. the current cell of the selected mine) and render new table
    board[MineY][MineX] = "RoboticSpaceship"
    Table.rows[MineY].cells[MineX].innerHTML = "<img id='RoboticSpaceship' src = img/RoboticSpaceship.png>"

    //clear the value of the original cell and render new table
    board[y][x] = 0
    Table.rows[y].cells[x].innerHTML = "";

    //Update the new position of the robotic spaceship
    RoboticSpaceshipPosition[i][0] = MineX
    RoboticSpaceshipPosition[i][1] = MineY

    //Reset MinePosition
    MinePosition = []

    //Update the number of unactivated mine in board and show message
    CountMine--
    ShowMessage("status","Status: <br>" +
        "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
        "Mines inactivated: "+CountMine+"<br>"+
        "Mines activated: "+CountActivatedMine+"<br>")
}

/**
 * Operate the move for robotic spaceship to a random nearby cell
 * Only called if robotic spaceship can move arbitrarily
 * @param x - The x coordinate of the robotic spaceship
 * @param y - The y coordinate of the robotic spaceship
 * @param i - The ith robotic spaceship in the array "RoboticSpaceshipPosition" is moving
 */
function RoboticSpaceshipRandomMove(x,y,i){
    //get a random cell that the robotic spaceship is going to move to
    var TargetX = getRandomNumber(x-1,x+1)
    var TargetY = getRandomNumber(y-1,y+1)
    console.log("Target: X=" + TargetX + " Y=" + TargetY)

    //The robotic spaceship must move if possible, so the target cell cannot be its original cell
    if (TargetX===x && TargetY===y){
        RoboticSpaceshipRandomMove(x,y,i) //make recursion and re-pick target cell
    }

    //The robotic spaceship must not go out of boundary
    else if (TargetX<0 || TargetY<0 || TargetX>9 || TargetY>9){
        RoboticSpaceshipRandomMove(x,y,i) //make recursion and re-pick target cell
    }

    //The robotic spaceship must not hit the asteroids
    else if (board[TargetY][TargetX] === "Asteroid"){
        RoboticSpaceshipRandomMove(x,y,i) //make recursion and re-pick target cell
    }

    //The robotic spaceship must not hit another robotic spaceship
    else if (board[TargetY][TargetX] === "RoboticSpaceship"){
        RoboticSpaceshipRandomMove(x,y,i) //make recursion and re-pick target cell
    }

    else {

        //If the target cell is surrounded by activated mines,
        //Then the robotic spaceship is destroyed
        if (RoboticSpaceshipNearActivatedMine(x,y)){

            //Directly erase the robotic spaceship's image
            board[y][x] = 0
            Table.rows[y].cells[x].innerHTML = ""

            //Erase that robotic spaceship from the array
            RoboticSpaceshipPosition.splice(i,1)

            //Update message shown
            CountRoboticSpaceship--
            ShowMessage("status","Status: <br>" +
                "Robotic spaceships left: "+CountRoboticSpaceship+"<br>"+
                "Mines inactivated: "+CountMine+"<br>"+
                "Mines activated: "+CountActivatedMine+"<br>")

            //If there is not any robotic spaceship left, end game and user wins
            if (CountRoboticSpaceship===0){
                End()
            }
        }

        //If the target cell is not surrounded by activated mines,
        //Robotic spaceship moves and update its position
        else{
            //Make the move on the board
            board[TargetY][TargetX] = "RoboticSpaceship"
            Table.rows[TargetY].cells[TargetX].innerHTML = "<img id='RoboticSpaceship' src = img/RoboticSpaceship.png>"
            board[y][x] = 0
            Table.rows[y].cells[x].innerHTML = ""

            //Change that robotic spaceship from the array
            RoboticSpaceshipPosition[i][0] = TargetX
            RoboticSpaceshipPosition[i][1] = TargetY
        }
    }

    //debugger
    console.log("RoboticSpaceshipPosition: "+RoboticSpaceshipPosition)
    console.log(board)
}


//================================== Part Six - End Stage ==================================//


/**
 * To replace user's spaceship with win image
 * only called when win condition triggered
 */
function WinImage(){
    board[UserSpaceshipY][UserSpaceshipX] = "WinImage"
    Table.rows[UserSpaceshipY].cells[UserSpaceshipX].innerHTML = "<img id='WinImage' src = img/Win.png>";
}

/**
 * To display End stage UI
 * called by function Play() & button "End game"
 */
function EndStageInfo(){
    ClearMessage("introduction")
    ClearMessage("introContent0")
    ClearMessage("introContent1")
    ClearMessage("introContent2")
    ClearMessage("introContent3")
    ClearMessage("introContent4")
    ClearMessage("introContent5")
    ClearMessage("Asteroid")
    ClearMessage("Mine")
    ClearMessage("RoboticSpaceship")
    ClearMessage("UserSpaceship")
    ShowMessage("introduction","Result")
    ShowMessage("introContent4","Click 'Restart' button <br> to restart the game")
    ShowMessage("stageHeader","End Stage")
}

/**
 * End stage of the game
 * Determine the outcome of the game
 */
function End(){
    //Display end-page UI
    EndStageInfo()

    EndStage = true

    // Win for the user if there are no robotic spaceships left on the grid but the user's spaceship has survived
    if (CountRoboticSpaceship===0 && UserSpaceshipExists){
        WinImage()
        ShowMessage("introContent3","You WIN!")
        ShowMessage("introContent4","You have defeated all robotic spaceships!")
    }

    // Win for the computer if the user's spaceship has been destroyed and at least one robotic spaceship has survived
    else if (CountRoboticSpaceship>0 && !UserSpaceshipExists){
        ShowMessage("introContent3","You LOSE!")
        ShowMessage("introContent4","Your spaceship has been defeated!")
    }

    //Otherwise, the outcome is a draw
    else{
        ShowMessage("introContent3","This is a DRAW game!")
    }
}

//===================================== End of the Code ======================================//

//================================== Part Seven - Reference ==================================//
//image used in this game are copyrighted from:
//(1)ActivatedMine.png - https://genshin-impact.fandom.com/wiki/Cor_Lapis
//(2)Arrow.png - https://pngtree.com/free-arrows-png
//(3)Asteroid.png - https://www.emojipng.com/preview/4039434
//(4)Error.png - https://didinqp.blogspot.com/2015/10/gagal.html
//(5)Mine.png - https://genshin-impact.fandom.com/wiki/Noctilucous_Jade
//(6)Win.png - https://www.pngaaa.com/detail/5675923
//Other images are own-made
