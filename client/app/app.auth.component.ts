import { Component, Input , OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './app.user';
import { UserService } from './user.service';

@Component({
  selector: 'app-auth',
  template: `
  <div class="container">
  <div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Log In</h3>
    </div>
    <div class="panel panel-body"> 
        <form (ngSubmit)="logIn()" class="auth-form">
            <input [(ngModel)]="name"  [ngModelOptions]="{standalone: true}" name="name" required placeholder="UserName">
            <input [(ngModel)]="password"  [ngModelOptions]="{standalone: true}" id="password" type="password" required placeholder="password"> 
            <button type="submit" class="btn btn-primary">Log In</button>
        </form>
    </div>
  </div>
  <div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Or Sign In</h3>
    </div>
    <div class="panel panel-body"> 
        <form (ngSubmit)="signUp()" class="auth-form">
            <input [(ngModel)]="newName"  [ngModelOptions]="{standalone: true}" name="newName" required placeholder="UserName">          
            <input [(ngModel)]="newPassword"  [ngModelOptions]="{standalone: true}" id="newPassword" type="password" required placeholder="password">
            <button type="submit" class="btn btn-primary" >Sign In</button>
        </form>
    </div>
  </div>
  </div>
  `
})
export class AuthComponent {

    private name        : String;
    private password    : String;
    private newName     : String;
    private newPassword : String;
    private token       : String;

    constructor( private userService : UserService , private router: Router ){

    }

    private logIn(){
        this.userService.authenticate(this.name, this.password)
        .then( (token) =>{
            //Save token and go to chat
            this.token = token;
            this.userService.setName(this.name);
            this.router.navigate(['/users']);
        })
        .catch( function(err){
            //Handle Error
            console.log(err);
        });
    }

    private signUp(){
        this.userService.signUp(this.newName, this.newPassword)
        .then( (token) => {
            //Save token and go to chat
            this.token = token;
            this.userService.setName(this.newName);
            this.router.navigate(['/users']);
        })
        .catch(function(err){
            //Handle Error
            console.log(err);
        });
    }
}