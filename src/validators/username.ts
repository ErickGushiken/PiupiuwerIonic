import { FormControl } from '@angular/forms';
import { UsuariosServiceProvider } from '../providers/usuarios-service/usuarios-service';
 
export class UsernameValidador {
    
    static usernameValido (control: FormControl,
        ){
 
       
 
        if(control.value==123){
            return ({usernameValido:true});
        }else{
            return (null);
        }
 
        
    }
 
}