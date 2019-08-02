module.exports = class ApplicationPolicy {
    constructor(user, record){
        this.record = record;
        this.user = user;
    }
    _isOwner(){
        return this.record && (this.record.userId == this.user.id);
    }
    _isAdmin(){
        return this.user && this.user.role == 2;
    }
    _isPremium(){
        return this.user && this.user.role == 1;
    }
    _isMember(){
        return this.user && this.user.role == 0;
    }
    new(){
        return this.user != null;
    }
    create(){
        return this.new();
    }
    show(){
        return true;
    }
    edit(){
        return this.new() && this.record && (this._isAdmin() || this._isMember() || this._isPremium());
    }
    showCollaborators(){
        return this.edit();
    }
    update(){
        return this.edit();
    }
    destroy(){
        return this.update();
    }
}