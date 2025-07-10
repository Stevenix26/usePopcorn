import { useEffect } from "react";


export  function useKey(key, action) {

    useEffect(function () {
        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();

            }
        }
        document.addEventListener("keydown", callback);
        // This effect will run when the component mounts and adds an event listener for the "keydown" event

        // Cleanup function to remove the event listener
        return function () {
            document.removeEventListener("keydown", callback);
        }

    }, [action, key]);

  
}
