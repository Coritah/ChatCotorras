import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {io} from 'socket.io-client'; //2 importamos
import { environment } from '../../../environments/environment';


interface ChatData {
  username: string;
  message: string;
  type? : 'message' | 'info',
  socketId?: string;
}


@Component({
  selector: 'app-chat',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

//3 creamos variable
socket =io (environment.wsUrl);




mensajes: ChatData[] = [
  { username: 'chipi', message: 'Hola Cora ¿que tal?' },
  { username: 'cora', message: 'hola Chipi. Estoy bien' },
];

clientesConectados: number = 0;



chatForm: FormGroup = new FormGroup({
  username: new FormControl('', Validators.required),
  message: new FormControl('', Validators.required)
});

//
ngOnInit(){
// envio envento del inicio al server
this.socket.on('chat_init',(messages: ChatData[])=>{
  this.mensajes = messages
})

  this.socket.on('chat_message_server',(data: ChatData)=>{
    // console.log(data)
    this.mensajes.push(data);
  })

  this.socket.on('clients_count', (clients: number) => {

    this.clientesConectados = clients;
    ;});


  

}


onSubmit() {
this.socket.emit('chat_message',
  {...this.chatForm.value, socketId: this.socket.id}) //el evento chat msg es inventado 
  this.chatForm.get('message')?.reset()
}
}
