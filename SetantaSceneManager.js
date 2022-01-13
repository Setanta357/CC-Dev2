Look into how the ImageManager works, and see if you can copy how it works.

Also look into overwriting the Scene_Status popScene method, something is buggy when it normally pops.  



If I am going to use multiple images to emulate animation, I will have to come up with a delay between images.
Use the photos app to determine what the appropriate delay should be.


If i am going to use video, then make the video using photos, then turn it into a webm file. Look into the Movie loader and try to copy that. However, there will still need to be a json to determine which video plays with what dialog.

Look into making Dialog Windows appear again.






var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.SM = Setanta.SM || {};
Setanta.SM.pluginName = "SetantaSceneManager";


function Scene_Movie(){
    this.initialize.apply(this, arguments);
}

Scene_Movie.prototype = Object.create(Scene_Base.prototype);
Scene_Movie.prototype.constructor = Scene_Movie;

Scene_Movie.prototype.initialize = function(){
    Scene_Base.prototype.initialize.call(this);
    this._sceneName = "";
    this.setHandler("ok", this.onInput.bind(this));
    this.setHandler("pagedown", this.onInput.bind(this));
}

Scene_Movie.prototype.loadScene = function(scene_name){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", movies + '/' + scene_name);
        xhr.overrideMimeType("application/json");
        xhr.onload = function(){
            if(xhr.status == 200){
                this.onLoad(xhr);
            }
        }
        //DO NOT DEFINE ERROR, IT WILL ERROR BECAUSE ITS DUMB
        xhr.send();
}

//Assuming Webms will be used
Scene_Movie.prototype.onLoad = function(response){
    
    var resJson = JSON.parse(xhr.response);
    var fileNames = resJson.file_names;
    var dialogs = resJson.dialogs;

    for(dialog in dialogs){
     
           // Load corresponding movie
           if(dialog < fileNames.length){ 
                    //the boolean is to denote 'repeat'
                    SceneLoader.load(fileName(dialog, true));
            }

            for(line of dialogs[dialog]){
                  let re = /\n\[\d+\]/;  
 	//Extract the Name
                  let name = line.match(re[0]);
	//Remove it from the line
	line = line.replace(name, "");
 
	//I don't know what the actual call is right now....
	GameMessage.show(name, line);

    	//Wait for player to hit enter, space, etc, etc
	while(!Input.isPressed("pagedown") || !Input.isPressed("ok") {}

            } 
       
    } 
    //Set a fade out, then pop the scene
     GameEvent.fadeOut();
    //Once all the loops are done, pop the scene
    Scene_Manager.pop();   
}

//Load file, set fields for files, dialog sets, current pointers. On player input, increment the dialog. If dialog at end of set, move to next set
//On each update, check to see if the video is playing, if it isn't, make it play, and ensure the dialog is still displayed.

Scene_Movie.prototype.onLoad = function(xhr) {

    var resJson = JSON.parse(xhr.response);
    this._fileNames = resJson.file_names;
    this._dialogs = resJson.dialogs;
    this._currentDialog = 0;
    this._currentDialogSet = 0;
    this._currentFileIndex = 0;

    this._video = Video.initialize(1008, 816);
    this._video.play(this._fileNames[this._currentFileIndex]);

    this.displayMessage();
}

Scene_Movie.prototype.update = function(){

    if(!this._video.isPlaying()) this._video.play(this._fileNames[this._currentFileIndex]);

   this.displayMessage();
}

Scene_Movie.prototype.displayMessage = function(){

    let re = /\n\[\d+\]/;  
    var dialogLine = (this._dialogs[this._dialogSet])[this._currentDialog];

    var name = dialogLine.match(re)[0];
    dialogLine = dialogLine.replace(name, "");

    GameMessage.message(name, dialogLine)
}
    
Scene_Movie.prototype.onInput = function(){

     //increment dialog line, if current value is more than current dialog set, then increment dialog set
    // if current dialog set is larger than all dialog sets end scene, otherwise check to see if its lets than size of files


    this._currentDialog += 1;
    if(this._currentDialog >= this._dialogs[this._dialogSet].length){
        this._dialogSet += 1;
        this._currentDialog = 0;
    }

    if(this._dialogSet >= this._dialogs.length()){
          this.fadeOut();
          Scene_Manager.pop();
    }
    else {
        if(this._dialogSet < this._fileNames.length - 1){
            this._video.play(this._fileNames[this._dialogSet])
        }
    }
}
