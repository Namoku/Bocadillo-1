import React, { useReducer } from "react";
import FirebaseReducer from "./FirebaseReduce";
import FirebaseContext from "./firebaseContext";
import firebase from "../../firebase";
import { OBTENER_PRODUCTOS_EXITO } from "../../types";


const FirebaseState = props => {
    //State Inicial
    
    const initialState = {
        menu: []
    }

    //useReducer con dispatch para ejecutar las funciones
    const [ state, dispatch ] = useReducer(FirebaseReducer, initialState); 


    //Funcion para traer productos
    const obtenerProductos = () =>{
      
        //Consultar firebase
       // firebase.db.settings({ experimentalForceLongPolling: true });
        firebase.db
            .collection('productos')
            .where('existencia', '==', true) //Trae el producto si solo existe    
            .onSnapshot(manejarSnapshot);
            
        function manejarSnapshot (snapshot){
            let platillos = snapshot.docs.map(doc =>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            });
            //Tenemos resultados
            dispatch({
                type: OBTENER_PRODUCTOS_EXITO,
                payload: platillos
            });
        }
    }

    return(
        <FirebaseContext.Provider
            value={{
                menu: state.menu
                ,firebase
                ,obtenerProductos
            }}

        >
            {props.children}
        </FirebaseContext.Provider>
    )
}
export default FirebaseState;