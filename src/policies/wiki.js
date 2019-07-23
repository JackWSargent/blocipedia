const ApplicationPolicy = require("./application");
module.exports = class WikiPolicy extends ApplicationPolicy {
    new(){
        return this._isPremium() || this._isMember();
    }
    create(){
        return this.new();
    }
    edit(){
        return this._isPremium() || this._isOwner();
    }
    update(){
        return this.edit();
    }
    destroy(){
        return this.update();
    }
}