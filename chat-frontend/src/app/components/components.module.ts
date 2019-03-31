import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ChatComponent } from './chat/chat.component';
import { InputAreaComponent } from './input-area/input-area.component';
import { UserComponent } from './user/user.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RouterModule } from '@angular/router';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { UserResolver } from './user/user.resolver';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    TopbarComponent,
    ChatComponent,
    InputAreaComponent,
    UserComponent,
    ContactsComponent,
    ChatAreaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    LoginComponent,
  ],
  providers: [
    UserResolver,
  ]
})
export class ComponentsModule { }
