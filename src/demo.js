import SearchBar from "./searchbar.js";
import Results from "./results.js";

import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';


export default function Demo() {
    const [query, setQuery] = useState(null);

    return (
        <div style={{paddingTop: "20px"}}>
            <SearchBar dispatch={setQuery} initalQuery={null}/>
            <Results query={query}/>
        </div>
    );
}
