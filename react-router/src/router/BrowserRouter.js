import {createBrowserHistory} from 'history'
import Router from "./Router";

function BrowserRouter(props) {
    const {children} = props
    const history = createBrowserHistory()
    return <Router history={history} children={children}/>
}

export default BrowserRouter
