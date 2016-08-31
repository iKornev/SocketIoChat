import { Component, Input , OnInit, ViewChild } from '@angular/core';
import * as io from 'socket.io-client'
import { Router, ActivatedRoute } from '@angular/router'

import { User } from './app.user';
import { UserService } from './user.service';
import { UserChatComponent } from './app.user-chat.component';
import { UserChatDirective } from './app.user-chat.directive';

@Component({
  selector: 'user-list',
  directives: [UserChatComponent, UserChatDirective],
  entryComponents : [UserChatComponent],
  template: `
  <div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Connected users</h3>
    </div>
    <div class="panel panel-body"> 
      <h4>Click on user name to start chat</h4>
      <ul class="list-group">
        <li *ngFor="let user of users" class="list-group-item"><button (click)="beginChat(user.name,'')"> {{user.name}} </button></li>
      </ul>
    </div>
  </div>
  <div chats class="chats"></div>
  `
})
export class UsersListComponent implements OnInit{
    @ViewChild(UserChatDirective) chatAnchor: UserChatDirective;
    users :   Object[];
    openChats : Object = {};
    
    constructor(private userService: UserService, private router: ActivatedRoute) {}

    getUsers(): void {
      let self:UsersListComponent = this;
      this.userService.getUsers().then( (users) => {
        //Filter the user's own name
        let ownIndex:number = -1;
        for(let u of users){
          if(u.name == self.userService.getName()){
            ownIndex = users.indexOf(u);
          }
        }
        
        if(ownIndex != -1){
          users.splice(ownIndex,1);
        }
        
        self.users = users;
      });
    }

    ngOnInit() {
      let self:UsersListComponent = this;
      self.userService.setSocket(io.connect("http://localhost:8080"));
      self.userService.getSocket().emit('register',{ name : self.userService.getName() })
      self.userService.getSocket().on('globalMessage',function(data){
        if(data.receiverName == self.userService.getName() && !self.openChats[data.receiverName]){
          self.beginChat(data.senderName,data.message);
        }
      });
      self.userService.getSocket().on('update',function(data){
        self.getUsers();
      });
      self.getUsers();
    }

    isNotCurrentUser(id:String){
      return id != this.userService.getSocket().id;
    }

    beginChat(receiverName:string,initialMessage:string){
      if(this.openChats[receiverName]){
        return;
      }
      
      this.openChats[receiverName] = receiverName;
      this.chatAnchor.createChat(UserChatComponent,receiverName, initialMessage);
    }
}