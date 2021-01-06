import {BrowserRouter as Router, Link, Switch, Route} from './router'
// import {BrowserRouter as Router, Link, Route} from './react-router-dom-nut'
// import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom'

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>component</h2>;
}

function Login() {
    return <h2>children</h2>;
}

function Users() {
    return <h2>render</h2>;
}

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/component">component</Link>
                        </li>
                        <li>
                            <Link to="/render">render</Link>
                        </li>
                        <li>
                            <Link to="/children">children</Link>
                        </li>
                    </ul>
                </nav>
                {/*<Switch>*/}
                <Route path="/children" children={Login}/>
                <Route path="/component" component={About}/>
                <Route path="/render" render={Users}/>
                <Route exact path="/">
                    <Home/>
                </Route>
                {/*</Switch>*/}
            </div>
        </Router>
    );
}

export default App;
