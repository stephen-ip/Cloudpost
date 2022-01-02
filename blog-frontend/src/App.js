import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router } from "@reach/router";

import Posts from './components/Posts'
import Post from './components/Post'

function App() {
  return (
    <div className="App">
      <Router>
        <Posts path="/" />
        <Post path="/post" />
      </Router>
    </div>
  );
}

export default App;
