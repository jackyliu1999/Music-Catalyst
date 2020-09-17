import { extendObservable } from "mobx";

class User {
    constructor()
    {
        extendObservable(this, {
            
            loading:true,
            isLoggedIn: false,
            username: ""

        })
    }
}

export default new User();