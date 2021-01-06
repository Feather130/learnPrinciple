import React, {useContext, createElement} from "react";
import {RouterContext} from "./RouterContext";
import matchPath from "./matchPath";

function Route(props) {
    const context = useContext(RouterContext)
    const {children, component, render} = props
    const {location} = context
    const match = matchPath(location.pathname, props)

    return match ?
        children ?
            (typeof children === 'function' ? children(props) : children) :
            component ? createElement(component) :
                render ? render(props) : null
        : typeof children === 'function' ? children(props) : null
}

export default Route
