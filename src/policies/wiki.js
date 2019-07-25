const ApplicationPolicy = require("./application");
module.exports = class WikiPolicy extends ApplicationPolicy {
    new(){
        return this._isPremium() || this._isMember() || this._isAdmin();
    }
    create(){
        return this.new();
    }
    edit(){
        return this._isAdmin() || this._isOwner() || (this._isOwner() && this._isPremium());
    }
    update(){
        return this.edit();
    }
    destroy(){
        return this.update();
    }
}