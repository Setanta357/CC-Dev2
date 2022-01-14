var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.SH = Setanta.SH || {};
Setanta.SH.pluginName = "SetantaSceneHandler";


function Scene_Loader(){
    this.initialize.apply(this, arguments);
};

Scene_Loader.prototype.initialize = function(){
    this._loadedScene = "";
};

Scene_Loader.prototype.loadScene = function(scene_name){
    this._loadedScene = scene_name;
    SceneManager.push(Scene_Play);
};

$sceneLoader = new Scene_Loader();

function Scene_Play(){
    this.initialize.apply(this, arguments);
};

Scene_Play.prototype = Object.create(Scene_Message.prototype);
Scene_Play.prototype.constructor = Scene_Play;

Scene_Play.prototype.initialize = function(){
    Scene_Message.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this._sceneName = $sceneLoader._loadedScene;

};

Scene_Play.prototype.create = function(){
    this.createBackground();
    this.createWindowLayer();
    this.createAllWindows();
    Scene_Base.prototype.create.call(this);
   
    this.loadSceneJson();    
};

Scene_Play.prototype.createBackground = function() {
    //Displayed Image
    this._curImg = new Sprite();
    this._backgroundFilter = new PIXI.filters.BlurFilter();

    //Blurred Background
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this._curImg.addChild(this._backgroundSprite);
    this.addChild(this._backgroundSprite)
    this.addChild(this._curImg)
    this.setBackgroundOpacity(192);
    this.setImgOpacity(255);
};

Scene_Play.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_Play.prototype.setImgOpacity = function(opacity) {
    this._curImg.opacity = opacity;
};

Scene_Play.prototype.loadSceneJson = function(){


    var filePath = "data/scenes/" + this._sceneName + ".json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filePath);
    xhr.overrideMimeType("application/json");
    xhr.onload = function(){
        if(xhr.status == 200){
            SceneManager._scene.populateFieldData(xhr)
        }
    }
    xhr.send();
};

Scene_Play.prototype.initScene = function(){
    
    this.loadImage();
    this.fillGameMessage(this._curDialog);
    
    this._sceneLoaded = true;

};

Scene_Play.prototype.populateFieldData = function(xhr){

    var sceneJson = JSON.parse(xhr.response);

    this._imgSetName = sceneJson.img_set_name;
    this._imgSets = sceneJson.img_sets;

    this._curImgIndex = this._imgSets[0][0];
    this._dialogs = sceneJson.dialogs;

    this._curDialog = 0;

    this._delay = sceneJson.delay;
    this._delta = 0;
    this.initScene();
};

Scene_Play.prototype.loadImage = function(){
    var folder = "img/scenes/" + this._imgSetName + "/";
    var file = this._curImgIndex.toString();


    var img = ImageManager.loadBitmap(folder,file);

    if(!img.isReady()){
        //prevents some skipping
        this._curImgIndex--;
    }
    if(img.isReady()){
        this._curImg.bitmap = null;
    }
    this._curImg.bitmap = img;
};

Scene_Play.prototype.fillGameMessage = function(index){
    var interpretList = [];
    for(line of this._dialogs[index]){

        var name = this.getName(line);
        line = this.stripDialog(name, line);

        var windowObj = this.getWindowObj(name);
        interpretList.push(windowObj);

        for(l of line.split("/n")){
            interpretList.push(this.getDialogObj(l))
        }
    }
    interpretList.push({code: 0, indent:0, parameters: []})
    this._interpreter.setup(interpretList)
};

Scene_Play.prototype.getName = function(line){
    var re = /\\n\[\d+\]/
    return line.match(re)[0];
};

Scene_Play.prototype.stripDialog = function(name, line){
    line = line.replace(name, "");
    return line;
};

Scene_Play.prototype.getWindowObj = function(name){

    return {
        code: 101,
        indent: 0,
        parameters: ["", 0, 0, 2, name]

    };
};

Scene_Play.prototype.getDialogObj = function(line){

    return {
        code: 401,
        indent: 0,
        parameters: [line]

    }
};

Scene_Play.prototype.update = function(){

    this._windowLayer.update();
    if(!this._sceneLoaded){
        this.initScene();
    }
    if(this._sceneLoaded){

        this._interpreter.update();
       
        if(this.readyToUpdateImage()){
            this.loadImage(this);
        }

        if(this.dialogReadyToUpdate()){
            this.updateDialog();
        }

        if(!$gameMessage.isBusy() && !this._dialogTransitioning){
            SceneManager.pop();
        }
    }
};

Scene_Play.prototype.dialogReadyToUpdate = function(){

    if(this.messageOnLast() && this.hasMoreMessages()){
        return true;
    }else if(this.messageOnLast() && !this.hasMoreMessages()){
        this._dialogTransitioning = false;
    }

};

Scene_Play.prototype.updateDialog = function(){
    this._dialogTransitioning = true;
    this._curDialog++;
    this.fillGameMessage(this._curDialog);
}

Scene_Play.prototype.messageOnLast = function(){
 
    if($gameMessage._texts){
        return $gameMessage._texts[0] === this._dialogs[this._curDialog][-1];
    }
    
};
Scene_Play.prototype.hasMoreMessages = function(){
    return this._curDialog < this._dialogs.length - 1;
};

Scene_Play.prototype.readyToUpdateImage = function(){
    if(this._delta == 0){
        if(this._curDialog >= this._imgSets.length){
            this.loadFinalImage();
        }
        else
        {
            this._curImgIndex++;
            if(this._curImgIndex > this._imgSets[this._curDialog][1]){
                this._curImgIndex = this._imgSets[this._curDialog][0];
            }
            this._delta = this._delay;
            this.loadImage(this);
        }
    }else{
        this._delta--;
    }
};

Scene_Play.prototype.loadFinalImage = function(){
    var finalImgNum = this._imgSets[this._imgSets.length-1][1];
    var img = ImageManager.loadBitmap("img/scenes/" + this._imgSetName + "/", finalImgNum.toString());
    if(img.isReady()){
        this._curImg.bitmap = null;
    }
    this._curImg.bitmap = img;
};
