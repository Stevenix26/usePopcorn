import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;

    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

 return [value, setValue];
}


// import { useState, useEffect } from "react";

// export function useLocalStorageState(initalState, key){
//     const [value,setValue] = useState(function(){
//         const storeValue = localStorage.getItem(key);
//         return storeValue ? JSON.parse(storeValue) : initalState;
//     });
//     useEffect(function(){
//         localStorage.setItem(key,JSON.stringify(value));
//     }, [value, key])
    
//     return [value, setValue];
    

// }
