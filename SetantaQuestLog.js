var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.QL = Setanta.QL || {};
Setanta.QL.pluginName = "SetantaQuestLog";


/*:
 * @plugindesc A questlog that allows you to add, update, and remove quests.
 * @author Setanta
 * @target MZ
 * @url There is none, if you have found this, then good job
 * 
 * 
 * @param Folder
 * @text Folder
 * @desc Folder Quests.json is stored in
 * @type string
 * @default data
 * 
 * @param File 
 * @text File
 * @desc the filename of the Quests.json file
 * @type string
 * @default Quests
 * 
 * @param Quest Log Command Label
 * @text Quest Log Command Label
 * @desc The label for the Quest Log button on the main menu
 * @type string
 * @default Quest Log
 * 
 * @param Quest List Font Size
 * @text Quest List Font Size
 * @desc The font size of Quest List Items
 * @type number
 * @default 18
 * 
 * 
 * @param Completed Steps Color
 * @text Completed Steps Color
 * @desc The color the Completed Steps display as, as a value 0 - 31, ref your window skin sheet
 * @type number
 * @default 29
 * 
 * 
 * @param Title Font Size
 * @text Title Font Size
 * @desc The font size of the Title that get's displayed in the Quest Description Window
 * @type number
 * @default 36
 * 
 * @param Description Font Size
 * @text Description Font Size
 * @desc The font size of the Quest Description
 * @type number
 * @default 22
 * 
 * @param Resolution Font Size
 * @text Resolution Font Size
 * @desc Font size of the resolution message
 * @type number
 * @default 20
 * 
 * 
 * 
 * @param Step Font Size
 * @text Step Font Size
 * @desc Font size of the displayed quest steps
 * @type number
 * @default 20
 * 
 * 
 * @command Add Quest
 * @text Add Quest
 * @desc Add a Quest to the Active Quest Log
 * 
 * 
 * @arg quest_id
 * @type number
 * 
 * 
 * @command Update Quest Step
 * @text Update Quest Step
 * @desc Increments the Quest to the next step
 * 
 * @arg quest_id
 * @type number
 * 
 * @arg force_complete
 * @type boolean
 * @default true
 * 
 * 
 * @command Complete Quest
 * @text Complete Quest
 * @desc Sets a quest's status to 'completed'
 * 
 * @arg quest_id
 * @type number
 * 
 *  
 * @command Remove Quest
 * @text Removes Quest
 * @desc Sets a quests status to 'removed'
 * 
 * @arg quest_id
 * @type number
 * 
 * 
 * @command Edit Quest
 * @text Edit Quest
 * @desc This will allow you to completely edit a quest on the fly.
 * 
 * @arg quest_id
 * @type number
 * 
 * 
 * @arg quest
 * 
 * 
 * @help
 * Setanta's Quest Logs
 * -------------------------------------------------------------------------------
 * Thank you for choosing Setanta's Quest Log. This is a simple quest log screen
 * that is based off of Galv's Quest Log for MV. It is not as well rounded as his,
 * and is rather rough to be honest, but it should still serve basic needs as
 * needed for Quests.
 * 
 * 
 * Getting Started:
 * 
 * Accessing Quest Log:
 * This is done by either selecting "Quest Log" from the Main Menu, or 
 * by pressing 'Q' or "PageUp" repsectively.
 * 
 * 
 * Storing Quest Data:
 * The Quest Log accesses quests that are stored in a json file under data.
 * By default, it accesses data/Quests.json. You can change this by modifying 
 * the respective parameters above for File and Folder.
 * 
 * 
 * Quest Format:
 * Each quest will need to be formated inside the Quests.json file like so
 * {
 *     "quest_id": quest_id,
 *     "title": "quest_title",
 *     "description": "quest_description",
 *     "quest_steps": quest_steps,
 *     "current_step": 0,
 *     "quest_step_description": [
 *        "quest step desc",
 *        "quest step desc2"
 *     ],
 *     "quest_step_resolution": [
 *        "",
 *        "quest step resolution1",
 *        "quest step resolution2"
 *     ],
 *     "actor_id": actor_id,
 *     "status": "inactive",
 *     "completion_message": "comp_msg",
 *     "game_variable": null
 * }
 * 
 * They are stored in an array so ensure that they are inside a set of brackets
 * like so: [{quest_contents}]
 * 
 * Each quest must have a unique numerical ID.
 * 
 * Since the descriptions and resolutions are array based, the first quest step
 * starts at '0', however, you are free to change this if you make the appropriate
 * changes to the respective arrays. Note that the resolution array starts with ""
 * this is also due to array's nature to start at 0.
 * You can set a completion message if you would like, however you can leave it
 * as null, and use a resolution message instead.
 * 
 * You are free to not include any resolution messages to.
 * 
 * 
 * There are several font sizes included in the parameters, feel free to 
 * mess around with them and adjust them to your liking.
 * 
 * The color parameter is based on the Window.png file you have saved with 
 * your game. It needs a value between 0 and 31 to work properly.
 * 
 * 
 * This system is designed to work with the text code replacements. For example,
 * if you were to use \n[1] in any of the text of the code, it would be replaced
 * with the corresponding actors name.
 * 
 * However, due to this, when wanting to add a new line to your text, instead of 
 * the standard \n, this checks for /n instead. This is to avoid any issue with
 * the Text Code replacements, and causing extra new lines where there shouldn't
 * be any.
 * 
 * 
 * ==============================================================================
 * COMMANDS
 * 
 * 
 * Add Quest:
 * This will add a quests to the "Active" category in the Quest Log. Pass in 
 * the quest_id corresponding to it. If the quest is already completed, or
 * already active, nothing will happen. 
 * 
 * 
 * 
 * Update Quest:
 * This will automatically update the quest by 1 step. It will also increment
 * the related Game Variable assigned at creation.
 *
 * 
 * 
 * Remove Quest:
 * This will remove the quest from the generated quest lists when the Quest Log
 * screen is loaded. This works by the quest_id as well.
 * 
 * 
 * 
 * Edit Quest:
 * This will allow you to edit a quest on the fly. You can either make a direct 
 * script call to Setanta.QL.editQuest(quest_id, newQuest) where newQuest
 * is a newly created Quest object to replace the old one, or you can 
 * define the new quest parameters in the plug-in call.
 * 
 * If using the plug-in call, i recommend copy-pasting it from your Quests.json
 * first, then making the needed changes in the editor.
 * 
 */


//==========================================================================
//          AUTO RUN CODE: Load Quests, and Update them as Needed
//==========================================================================


(function() {

    Setanta.QL.file = {};
    //On Load, load the quests file
    Setanta.QL.file.getQuests = function(filePath){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", filePath);
        xhr.overrideMimeType("application/json");
        xhr.onload = function(){
            if(xhr.status == 200){
                Setanta.QL.onload(xhr);
            }
        }
        //DO NOT DEFINE ERROR, IT WILL ERROR BECAUSE ITS DUMB
        xhr.send();

    };

    //Once the Quests have been loaded, check if anything needs to be updated
    Setanta.QL.onload = function(xhr){
        Setanta.QL.quests = JSON.parse(xhr.response);
        if($gameSystem && $gameSystem._quests){
            Setanta.QL.checkQuestsForUpdates();
        }    
    };



    //This is gross, and does too much, but it reduces object passing
    Setanta.QL.checkQuestsForUpdates = function(){

        var updated = false;
        //For every quest in Setanta.QL.quests
        //1. Check if its in the gameSystem, if not, add it
        //2. If it is, check to see if theres been any changes EXCEPT the current_step
        //3. If so, update the quest in $gameSystem, 
        for(quest of Setanta.QL.quests){
            //Grab the quest_id
            var qId = quest.quest_id;
            //Check if its in the system
            var questIndex = $gameSystem._quests.quests.findIndex(q => q.quest_id === qId);

            if(questIndex >= 0){
                //Check to see if there is anything new
                //if so, update appropriately
                //If quest_steps differ, make sure to move accordingly
                var oldQuest = $gameSystem._quests.quests[questIndex];
                if(oldQuest.quest_steps < quest.quest_steps){
                    Setanta.QL.refreshQuest(quest, questIndex);
                    if(!updated) updated = true;
                }
                else{
                    if(Setanta.QL.needsUpdate(oldQuest, quest)){
                        quest.quest_step = oldQuest.current_step;
                        quest.quest_status = oldQuest.status;
                        $gameSystem._quests.quests[questIndex] = quest;
                        if(!updated) updated = true;
                    }
                }
            }
            else{
                //Otherwise, add it to the quest list
                $gameSystem._quests.quests.push(quest);
                if(!updated) updated = true;
            }
        }

        // NOTE: May Possibly Add a $gameVariable flag here to run a gabMessages call at startup
        // to notify the player that their quests have been updated
        if(updated){

        }
    };

    Setanta.QL.refreshQuest = function(newQuest, questIndex){
        if($gameSystem._quests.quests[questIndex].status !== 'inactive' && $gameSystem._quests.quests[questIndex].status !== 'removed'){
            newQuest.status = 'active';
        }
        newQuest.current_step = $gameSystem._quests.quests[questIndex].current_step;
        $gameSystem._quests.quests[questIndex] = newQuest;
        
    };

    //Ensures that only the desired fields are compared, and returns true if 
    Setanta.QL.needsUpdate = function(oldQuest, newQuest){
        return newQuest.title !== oldQuest.title 
        || newQuest.description !== oldQuest.description
        || newQuest.quest_steps !== oldQuest.quest_steps
        || !Setanta.QL.compareArrays(newQuest.quest_step_description, oldQuest.quest_step_description)
        || !Setanta.QL.compareArrays(newQuest.quest_step_resolution, oldQuest.quest_step_resolution)
        || newQuest.actor_id !== oldQuest.actor_id
        || newQuest.completion_message !== oldQuest.completion_message
        || newQuest.game_variable !== oldQuest.game_variable;
    };

    //Compares arrays element by element
    Setanta.QL.compareArrays = function(a, b){
        return Array.isArray(a)
               && Array.isArray(b)
               && a.length === b.length 
               && a.every((val, index) => val === b[index]);
    };


    //This function runs automatically
    Setanta.QL.fileName = function(){
        if(!Setanta.QL.quests){
            var fileName = PluginManager.parameters(Setanta.QL.pluginName)['File'];
            var folder = PluginManager.parameters(Setanta.QL.pluginName)['Folder'];
            if(!folder.contains("/")){
                folder += "/";
            }
            Setanta.QL.file.getQuests(folder + fileName + ".json");
        }
    }(); //The (); forces this to run instantly

})();

//==========================================================================
//                           Plugin Parameters
//==========================================================================

Setanta.QL.questLogCommandLabel = PluginManager.parameters(Setanta.QL.pluginName)['Quest Log Command Label'];
Setanta.QL.questListFontSize = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Quest List Font Size']);
Setanta.QL.titleFontSize = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Title Font Size']);
Setanta.QL.completedStepsColor = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Completed Steps Color']);
Setanta.QL.descriptionFontSize = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Description Font Size']);
Setanta.QL.resolutionFontSize = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Resolution Font Size']);
Setanta.QL.stepFontSize = parseInt(PluginManager.parameters(Setanta.QL.pluginName)['Step Font Size']);

//==========================================================================
//                             System Fuckery
//==========================================================================


//Update Game loader so those that load their old games can update the quests with the new updates.
Setanta.QL.LoadGame = DataManager.loadGame;
DataManager.loadGame = function(savefileId){
    //Save Response
    return Setanta.QL.LoadGame.call(this, savefileId).then(response => {
        //Update Quests
        if(Setanta.QL.quests && $gameSystem._quests){
            Setanta.QL.checkQuestsForUpdates();
        }
        else{
            $gameSystem._quests = {};
            $gameSystem._quests.quests = Setanta.QL.quests;
        }
        //Return response so it can work with the .then() call.
        return response;
    });
    
};

//Add Quests for New Game
Setanta.QL.SetupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    Setanta.QL.SetupNewGame.call(this);
    Setanta.QL.checkQuestsForUpdates();
};


//Update the Game_System so that it can create the _quests object
Setanta.QL.Game_System_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    Setanta.QL.Game_System_Initialize.call(this);
    if(!this._quests){
        this._quests = {
            quests: [], //holds all the quests
            active: [], //holds only "active" quests
            completed: [] //holds only "completed" quests
        };
    };
   
};

Setanta.QL.UpdateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    Setanta.QL.UpdateScene.call(this);
    if(!SceneManager.isSceneChanging()){
        if(Input.isTriggered("pageup")){
            Setanta.QL.viewLog();
        }
    }
    
};


//==========================================================================
//                             Main Menu Fuckery
//==========================================================================

    
Setanta.QL.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
//Define our own
Window_MenuCommand.prototype.addOriginalCommands = function(){
    Setanta.QL.Window_MenuCommand_addOriginalCommands.call(this);
    this.addQuestLogCommand();
};

//Define addQuestLogCommand, label the command, give the command a symbol value and enable it
Window_MenuCommand.prototype.addQuestLogCommand = function(){
    var enabled = true;
    this.addCommand(Setanta.QL.questLogCommandLabel, 'quest', enabled);
};

//Overwrite createCommandWindow to also handle the quest log command
Setanta.QL.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function(){
    Setanta.QL.Scene_Menu_createCommandWindow.call(this);
    //Window_MenuCommand contains a _commandWindow object
    //_commandWindow has a function setHandler to handle what happens
    //when a command with the first parameter is selected, the function
    //or second parameter is what happens on the ok
    this._commandWindow.setHandler('quest', this.commandQuestLog.bind(this));
};

Scene_Menu.prototype.commandQuestLog = function(){
    //viewLog is a function defined by me to launch the quest log
    //SceneManager.push(Scene_QuestLog)
    Setanta.QL.viewLog();
};

//==========================================================================
//                                Command Code
//==========================================================================

Setanta.QL.viewLog = function(){
    SceneManager.push(Scene_QuestLog);
};


Setanta.QL.buildCategoryLists = function(){
    if($gameSystem._quests){
        //Clear Lists
        Setanta.QL.clearCategoryLists();
        //Rebuild Lists
        for(quest of $gameSystem._quests.quests){
            switch(quest.status){
                case 'active':
                    $gameSystem._quests.active.push(quest);
                    break;
                case 'completed':
                    $gameSystem._quests.completed.push(quest);
                    break;
                default:
                    break;
            }
        }
    }
};

Setanta.QL.clearCategoryLists = function(){
    if($gameSystem._quests){
        $gameSystem._quests.active = [];
        $gameSystem._quests.completed = [];
    }
};

Setanta.QL.getActiveQuests = function(){
    if($gameSystem._quests){
        return $gameSystem._quests.active;
    }
    else{
        return [];
    }
};

Setanta.QL.getCompletedQuests = function(){
    if($gameSystem._quests){
        return $gameSystem._quests.completed;
    }
    else{
        return [];
    }
};

//==========================================================================
//                          Registered Commands
//==========================================================================


//Command To Add Quest
PluginManager.registerCommand(Setanta.QL.pluginName, 'Add Quest', args => {
    Setanta.QL.addQuest(args.quest_id);
});
//Command To Update Quest Step

PluginManager.registerCommand(Setanta.QL.pluginName, 'Update Quest Step', args => {
    Setanta.QL.updateQuestStep(args.quest_id, args.force_complete);
});
//Command To Complete Quest

PluginManager.registerCommand(Setanta.QL.pluginName, 'Complete Quest', args => {
    Setanta.QL.completeQuest(args.quest_id);
});

//Command To Remove Quest
PluginManager.registerCommand(Setanta.QL.pluginName, 'Remove Quest', args =>{
    Setanta.QL.removeQuest(args.quest_id);
});

//Command To Get Quests by Actor Id
PluginManager.registerCommand(Setanta.QL.pluginName, 'Get Quests By Id', args => {
    return Setanta.QL.getQuestsByActorId(args.actor_id);
});

PluginManager.registerCommand(Setanta.QL.pluginName, 'Edit Quest', args => {
    Setanta.QL.editQuest(args.quest_id, args.quest);
})

//==========================================================================
//                               My Commands
//==========================================================================

Setanta.QL.addQuest = function(quest_id){
    if($gameSystem._quests && Setanta.QL.quests){
        var index = Setanta.QL.getGlobalQuestIndexById(quest_id);
        if(index < 0){
            //Check game system for quest, if not in game system, get it from Setanta Quests
            //If not in setatna quests, do nothing
            var sIndex = Setanta.QL.getLocalQuestIndexById(quest_id);
            if(sIndex >= 0){
                $gameSystem._quests.quests.push(Setanta.QL.quests[sIndex]);
                index = $gameSystem._quests.quests.length - 1;
            }else{
                return;
            }
        }
        
        //check quest status, if inactive then set to active, otherwise do nothing
        if($gameSystem._quests.quests[index].status == 'inactive' || $gameSystem._quests.quests[index].status == 'removed'){
            $gameSystem._quests.quests[index].status = 'active';
            $gameSystem._quests.quests[index].current_step = 0;
            if($gameSystem._quests.quests[index].game_variable){
                $gameVariables._data[$gameSystem._quests.quests[index].game_variable] = 0;
            }
        }
    }

};

// Force complete will allow the user to decide if 
// it should be moved to completed if the next step
// is greater than the amounts of steps
Setanta.QL.updateQuestStep = function(quest_id, force_complete){
    if($gameSystem._quests && Setanta.QL.quests){

        var index = Setanta.QL.getGlobalQuestIndexById(quest_id);

        if(index >= 0){

            var quest = $gameSystem._quests.quests[index];

            if(quest.status == 'active'){
                //Update Quest Step and Corresponding Game Variable
                quest.current_step += 1;
                $gameVariables._data[quest.game_variable] += 1;

                if(force_complete && quest.current_step >= quest.quest_steps){
                    quest.status = 'completed';
                }

                $gameSystem._quests.quests[index] = quest;
            }
        }
    }
};

Setanta.QL.completeQuest = function(quest_id){
    if($gameSystem._quests && Setanta.QL.quests){
        var index = Setanta.QL.getGlobalQuestIndexById(quest_id);

        if(index >= 0){
            $gameSystem._quests.quests[index].status = 'completed';
        }
    }
};

//Sets quest status to 'removed'
Setanta.QL.removeQuest = function(quest_id){
    if($gameSystem._quests && Setanta.QL.quests){
        var index = Setanta.QL.getGlobalQuestIndexById(quest_id);
        if(index >= 0){
            $gameSystem._quests.quests[index].status = 'removed';
        }
    }
};


Setanta.QL.getQuestsByActorId = function(actor_id){
    var questList = [];
    if($gameSystem._quests){
        for(quest of $gameSystem._quests.quests){
            if(quest.actor_id == actor_id){
                questList.push(quest);
            }
        }
    }
    return questList;

};

Setanta.QL.getGlobalQuestIndexById = function(quest_id){
    if($gameSystem._quests){
        return $gameSystem._quests.quests.findIndex(quest => quest.quest_id == quest_id);
    }
    else {
        return -1;
    }
};

Setanta.QL.getLocalQuestIndexById = function(quest_id){
    if(Setanta.QL.quests){
        return Setanta.QL.quests.findIndex(quest => quest.quest_id == quest_id);        
    }
    else{
        return -1;
    } 
};

//This can be used to change a quest on the fly, or even add a quest on the fly
Setanta.QL.editQuest = function(quest_id, newQuest){
    
    if(newQuest.quest_id == quest_id){
        var index = Setanta.QL.getGlobalQuestIndexById(quest_id);
        if(index >= 0){
            $gameSystem._quests.quest[index] = newQuest;
        }
        else{
            index = Setanta.QL.getLocalQuestIndexById(quest_id);
            if(index >= 0){
                $gameSystem._quests.quests.push(newQuest);
            }
        }
        
    }
};
//==========================================================================
//                                Scene Fuckery
//==========================================================================

//Constructor that calls Scene_MenuBase's initialize
function Scene_QuestLog(){
    this.initialize.apply(this, arguments);
};

//Create an object based on Scene_MenuBase
Scene_QuestLog.prototype = Object.create(Scene_MenuBase.prototype);
//Set the constructor appropriated
Scene_QuestLog.prototype.constructor = Scene_QuestLog;

//Override the create function to add our windows
Scene_QuestLog.prototype.create = function(){
    Scene_MenuBase.prototype.create.call(this);
    this.createCategoryCommandWindow();
    this.createQuestListWindow();
    this.createQuestDescriptionWindow();
}

Scene_QuestLog.prototype.createCategoryCommandWindow = function(){
    //Make Windows
    const commandWindow = new Window_CategoryCommand();
    this._commandWindow = commandWindow;
    //Set handlers for choices
    this._commandWindow.setHandler('active', this.onCategoryOk.bind(this));
    this._commandWindow.setHandler('completed', this.onCategoryOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    //Save to Reference Later
    
    //Add Window 
    this.addWindow(this._commandWindow);
};

Scene_QuestLog.prototype.onCategoryOk = function(){
    var symbol = this._commandWindow.currentSymbol();
    this._listWindow.setCategory(symbol);
  //  this._commandWindow.deactivate();
    this._listWindow.activate();
    this._listWindow.select(0);

};

Scene_QuestLog.prototype.popScene = function(){
    SceneManager.pop();
};

Scene_QuestLog.prototype.createQuestListWindow = function(){
    //Calculate where the top of the window will be
    const windowTop = this._commandWindow.y + this._commandWindow.height;
    //create the window
    const questListWindow = new Window_QuestList(windowTop);


    this._listWindow = questListWindow;
    this._listWindow.setHandler('ok', this.onItemOk.bind(this));
    this._listWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._listWindow);


};

Scene_QuestLog.prototype.onItemCancel = function(){
    this._descWindow.clear();
    this._listWindow.deselect();
    this._commandWindow.activate();
};

Scene_QuestLog.prototype.onItemOk = function(){
    var quest = this._listWindow.item(this._listWindow._index);
    this._descWindow.setItem(quest);

    this._listWindow.activate();
    
};

Scene_QuestLog.prototype.createQuestDescriptionWindow = function(){
    //Calculate where the top of the window will be
    const windowTop = this._commandWindow.y + this._commandWindow.height;
    //create the window
    const questDesc = new Window_QuestDesc(windowTop);
    this._descWindow = questDesc;
    this.addWindow(this._descWindow);
};

Scene_QuestLog.prototype.onDescCancel = function(){
    this._descWindow.deactivate();
    this._listWindow.activate();
    this._listWindow.reselect();
}



//==========================================================================
//                               Window Fuckery
//==========================================================================

//==========================================================================
//                             Command Category Window
//==========================================================================

function Window_CategoryCommand(){
    this.initialize.apply(this, arguments);
}

Window_CategoryCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_CategoryCommand.prototype.initialize = function(){
    const windowRect = this.getWindowRect();
    Window_HorzCommand.prototype.initialize.call(this,windowRect);
    this._canRepeat = true;
};

Window_CategoryCommand.prototype.getWindowRect = function(){
    var wh = Scene_MenuBase.prototype.calcWindowHeight(1, true);
    var wy = Scene_MenuBase.prototype.helpAreaTop();
    var wx = 0;
    var ww = Graphics.boxWidth;
    return new Rectangle(wx, wy, ww, wh);
};

Window_CategoryCommand.prototype.makeCommandList= function() {
    this.addCommand("Active", 'active');
    this.addCommand("Completed", 'completed');
};

Window_CategoryCommand.prototype.itemWidth = function(){
    return Math.floor(this.innerWidth/2);
};





//==========================================================================
//                             Quest List Window
//==========================================================================

function Window_QuestList(){
    this.initialize.apply(this, arguments);
};

Window_QuestList.prototype = Object.create(Window_ItemList.prototype);
Window_QuestList.prototype.constructor = Window_QuestList;

Window_QuestList.prototype.initialize = function(top){
    const windowRect = this.getWindowRect(top);
    Window_ItemList.prototype.initialize.call(this, windowRect);

};

Window_QuestList.prototype.isCurrentItemEnabled = function(){
    return true;
}

Window_QuestList.prototype.getWindowRect = function(top){
    var wy = top;
    var wh = Graphics.boxHeight - top;
    var ww = Graphics.boxWidth/2;
    var wx = 0;
    return new Rectangle(wx, wy, ww, wh);

};


Window_QuestList.prototype.refresh = function(){
    //Set data to the correct list
    this.makeItemList();
    //Build the bitmap
    this.createContents();
    //Optional stylings
    this.setStyling();
    //Draw Items
    this.drawAllItems();
};

Window_QuestList.prototype.makeItemList = function(){
   //populate $gameSystem._quests.active and $gameSystem._quests.completed
   //then poop the right one based on category into this._data
   Setanta.QL.buildCategoryLists();
   switch(this._category){
        case 'active':
            this.setActiveList();
            break;
        case 'completed':
            this.setCompletedList();
            break;
        default:
            break;
   };
  
};

Window_QuestList.prototype.setActiveList = function(){
    this._data = Setanta.QL.getActiveQuests();
};

Window_QuestList.prototype.setCompletedList = function(){
    this._data = Setanta.QL.getCompletedQuests();

};

Window_QuestList.prototype.setStyling = function(){
    this.contents.fontSize = Setanta.QL.questListFontSize;
};

Window_QuestList.prototype.item = function(index){
    var index = index == undefined ? this.index() : index;
    var obj = isNaN(this._data[index]) ? this._data[index] : $gameSystem._quests.quests[this._data[index]];

    return this._data && index >= 0 ? obj : null;
};

//Define the Draw Item
Window_QuestList.prototype.drawItem = function(index){
    //Get item
    var item = this.item(index);
    if(item){
        //Get the Item Rect
        var rect = this.itemRect(index);
        //adjust for padding
        rect.width -= this.itemPadding();
        var txt = item.title;
        var text_x = rect.x + this.itemPadding();
        var text_y = rect.y + Math.round(this.itemPadding()/2);
        txt = this.convertEscapeCharacters(txt);
        this.drawText(txt, text_x, text_y, rect.width);
    }   
};

//Define a Draw Item and Draw All Items functions
Window_QuestList.prototype.maxCols = function() {
    return 1;
};

Window_QuestList.prototype.itemWidth = function(){
    return this.innerWidth;
};

// //Overwritten to clear the List Window on deselect
Window_QuestList.prototype.deselect = function(){
    this.destroyContents();
    this.select(-1);
};

Window_QuestList.prototype.setCategory = function(category){
    if(this._cateogry !== category){
        this._category = category;
    }
    this.refresh();
}



//==========================================================================
//                             Quest Desc Window
//==========================================================================


function Window_QuestDesc(){
    this.initialize.apply(this,arguments);
};

Window_QuestDesc.prototype = Object.create(Window_Base.prototype);
Window_QuestDesc.prototype.constructor = Window_QuestDesc;

Window_QuestDesc.prototype.initialize = function(top){
    const questDescWindow = this.getQuestDescWindow(top);
    Window_Base.prototype.initialize.call(this, questDescWindow);
    this.refresh();

}

Window_QuestDesc.prototype.getQuestDescWindow = function(top){
    var wy = top;
    var wh = Graphics.boxHeight - top;
    var ww = Graphics.boxWidth/2;
    var wx = Graphics.boxWidth/2;
    return new Rectangle(wx, wy, ww, wh);

};

Window_QuestDesc.prototype.clear = function(){
    this.setItem();
}

Window_QuestDesc.prototype.setItem = function(quest){
    if(this._quest !== quest){
        this._quest = quest;
       this.refresh();
    }
};

Window_QuestDesc.prototype.refresh = function(){
    this.contents.clear();
    if(this._quest){
        this.drawQuest(this._quest);
    }
    else{
        this.drawNoQuest();
    }
};

Window_QuestDesc.prototype.testTitle = function(title){
    var y = this.contentsHeight() / 2 - this.contents.fontSize / 2 - $gameSystem.windowPadding();
    title = this.convertEscapeCharacters(title);
    this.drawText(title, 0, y, this.contentsWidth(), 'center');
};

Window_QuestDesc.prototype.drawNoQuest = function(){
    var y = this.contentsHeight() / 2 - this.contents.fontSize / 2 - $gameSystem.windowPadding();
    this.drawText("No Quest Selected", 0, y, this.contentsWidth(), 'center');
}


Window_QuestDesc.prototype.drawHorzLine = function(y) {
    var lineY = y + this.padding;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, ColorManager.normalColor());
    this.contents.paintOpacity = 255;
    return lineY + 2;
};


Window_QuestDesc.prototype.drawQuest = function(quest){

    if(!quest.title) return;
    //Set Title Color
    this.changeTextColor(ColorManager.normalColor());
    var y = this.drawTitle(quest.title);

    //Draw Horizontal Line
    y = this.drawHorzLine(y);

    y = this.drawQuestDescription(y, quest.description);

    y = this.drawHorzLine(y);

    
    if(quest.status == 'completed' && quest.completion_message != null){
        y = this.drawCompletionMessage(y, quest.completion_message);
        y = this.drawQuestSteps(y, quest, quest.completion_message != "");
    }
    else {
        y = this.drawResolutionMessage(y, quest.quest_step_resolution[quest.current_step]);
        y = this.drawQuestSteps(y, quest, quest.quest_step_resolution[quest.current_step] != "");
    }

    this.resetTextColor();  
   

    
}

Window_QuestDesc.prototype.drawTitle = function(title){
    this.contents.fontSize = Setanta.QL.titleFontSize;
    var x = this.padding;
    var y = this.padding;
    title = this.convertEscapeCharacters(title);
    this.drawText(title, x, y, this.contentsWidth(), 'left');
    return y + Setanta.QL.titleFontSize;
    
};

Window_QuestDesc.prototype.drawQuestDescription = function(y, description){

    var descY = y + this.padding;
    var lines = description.split('/n');
    var lineHeight = Setanta.QL.descriptionFontSize + this.padding/2;

    this.contents.fontSize = 24;
    this.drawText("Description: ", 0, descY, this.contentsWidth());
    descY += 24 + this.padding/2;

    for(line of lines){
        this.contents.fontSize = Setanta.QL.descriptionFontSize;
        line = this.convertEscapeCharacters(line);
        this.drawText(line, 0, descY, this.contentsWidth());
        descY += lineHeight;
    }

    return descY;
};

Window_QuestDesc.prototype.drawResolutionMessage = function(y, resolution){
    y += this.padding;
    this.contents.fontSize = Setanta.QL.resolutionFontSize;
    if(resolution != "") {
        resolution = this.convertEscapeCharacters(resolution);
        this.drawText(resolution, 0, y, this.contentsWidth(), 'left');
        y += this.contents.fontSize;
    }
    return y;
};

Window_QuestDesc.prototype.drawCompletionMessage = function(y, completion_message){
    y += this.padding;
    this.contents.fontSize = Setanta.QL.resolutionFontSize;
    if(completion_message != ""){
        completion_message = this.convertEscapeCharacters(completion_message);
        this.drawText(completion_message, 0, y, this.contentsWidth(), 'left');
        y += this.contents.fontSize;
    }
    
    return y;
};

Window_QuestDesc.prototype.drawQuestSteps = function(y, quest, hasResolution){
    
    //Lower it by a gap
    if(hasResolution) y += 25; 

    for(var i = 0; i < quest.current_step; i++){
        y = this.drawCompletedStep(y, quest.quest_step_description[i]);
    };

    if(quest.current_step < quest.quest_steps) y = this.drawCurrentStep(y, quest.quest_step_description[quest.current_step]);
    return y;
};

Window_QuestDesc.prototype.drawCompletedStep = function(y, desc){
    this.changeTextColor(ColorManager.textColor(Setanta.QL.completedStepsColor));
    this.contents.fontSize = Setanta.QL.stepFontSize;
    desc = this.convertEscapeCharacters(desc);
    this.drawText(desc, 0, y, this.contentsWidth(), 'left');

    y += this.contents.fontSize + this.padding/2;
    return y;
};


Window_QuestDesc.prototype.drawCurrentStep = function(y, desc){
    this.resetTextColor();
    this.contents.fontSize = Setanta.QL.stepFontSize;
    desc = this.convertEscapeCharacters(desc);
    this.drawText(desc, 0, y, this.contentsWidth(), 'left');
    y += this.contents.fontSize + this.padding/2;
    return y;
}

