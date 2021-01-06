import {RouterContext} from "./RouterContext";
import {useState, useEffect} from "react";

function Router(props) {
    const {history, children} = props
    const [location, setLocation] = useState(history.location)
    const unlisted = history.listen(e => {
        setLocation({...e.location})
    })

    useEffect(() => {
        return () => {
            if (unlisted) {
                unlisted()
            }
        }
    }, [])

    return <RouterContext.Provider value={{history, location}}>{children}</RouterContext.Provider>
}

export default Router
