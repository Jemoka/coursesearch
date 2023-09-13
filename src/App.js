import Demo from "./demo.js";

function App() {

    return (
        <div style={{"width": "100vw", "padding": "50px"}}>
            <h1>Hello! Let's search some courses.</h1>
            <p>We currently use data from September, 2023, and can only search courses in the 2023-2024 term.</p>
            <p>Want to learn more or build something like this? This tool uses <a href="https:simon.shabang.io">simon</a> in the backend; it is an open source semantic search package for Python. Have an issue? <a href="https:github.com/Jemoka/coursesearch/issues">File it on GitHub.</a></p>
            <p><b>Caution: I really hope this tool is useful, but its still a large-language model running the show. I make no garantees of the accuracy of the info presented. It told me CS107 is an easy class. It is not.</b></p> 

            <Demo />
        </div>
    );
}

export default App;
