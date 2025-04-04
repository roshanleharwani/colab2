import {create} from  "zustand";
import {persist} from "zustand/middleware";

const useUserStore=create(
    persist(
        (set)=>({
            user:null,// intially no user
            setUser:(userData)=>set({user:userData}),
            clearUser:()=>set({user:null})
        }),
        {
            name:"user",// unique name
            getStorage:()=>localStorage
        }
    )
)

export default useUserStore;