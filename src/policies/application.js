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
    _isCollaborator(){
        this.record.collaborators.forEach(collaborator => {
            if(collaborator == this.user.id){
                return true;
            }
        })
        return false;
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
        return this.new() && this.record && (this.record.private == false && (this._isAdmin() || this._isMember() || this._isPremium()));
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