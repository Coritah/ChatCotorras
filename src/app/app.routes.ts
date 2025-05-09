import type { Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    {
        path:'', pathMatch: 'full', redirectTo:'/chat'
    },
    { path: 'chat', component: ChatComponent},
    {path: '**', redirectTo:'/chat'}
];
