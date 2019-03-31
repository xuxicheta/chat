import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import { UserComponent } from './components/user/user.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserResolver } from './components/user/user.resolver';
import { LoggedGuard } from './common/guards/logged.guard';
import { UnLoggedGuard } from './common/guards/unlogged.guard';

const indexRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [UnLoggedGuard], },
  { path: 'register', component: UserComponent, canActivate: [UnLoggedGuard], },
  { path: 'user/:id', component: UserComponent, resolve: { user: UserResolver }, canActivate: [LoggedGuard], },
  { path: 'user', component: UserComponent, resolve: { user: UserResolver }, canActivate: [LoggedGuard], },
  { path: 'chat', component: ChatComponent, canActivate: [LoggedGuard], },

];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    RouterModule.forRoot(indexRoutes),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LoggedGuard,
    UnLoggedGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
