import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    TopbarComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginComponent,
  ]
})
export class ComponentsModule { }
