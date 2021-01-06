import {RouterContext} from "./RouterContext";
import {useContext} from "react";

function Link(props) {
    const {to, children, restProps} = props
    const context = useContext(RouterContext)
    const handleClick = (e) => {
        e.preventDefault()
        context.history.push(to)
    }
    return <a href={to} {...restProps} onClick={handleClick}>{children}</a>
}

export default Link
