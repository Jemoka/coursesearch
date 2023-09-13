import Demo from "./demo.js";
import "./App.css";

function App() {

    return (
        <div style={{"width": "100vw", "padding": "50px"}}>
            <h1 className="heading">Hello! Let's explore some courses.</h1>
            <p className="descr">We currently use data from September, 2023, and can only search courses in the 2023-2024 term.</p>
            <p className="descr">Wonder how this is built? This tool uses <a href="https:simon.shabang.io" className="link">simon</a> in the backend; it is an open source semantic search package for Python. Have an issue? <a href="https:github.com/Jemoka/coursesearch/issues" className="link">File it on GitHub.</a></p>
            <p className="descr">Caution: I really hope this tool is useful, but its still a large-language model running the show. I make no garantees of the accuracy of the info presented. It told me CS107 is an easy class. It is not.</p> 

            <Demo />
        </div>
    );
}

export default App;
