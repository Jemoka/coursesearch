// react stuff
import { useState, useEffect, useRef } from 'react';

import styles from "./results.module.css";
import "./results.css";

export default function Results({query, alertDone}) {
    const [queryResults, setQueryResults] = useState({search_results: []});
    const [isDone, setDone] = useState(null);

    useEffect(() => {
        const work = async () => {
            if (query == null) {
                return
            }

            setDone(false);
            setQueryResults({search_results: []})
            let baseURL = new URL("/query", "https://beta.api.simon.shabang.io");
            baseURL.searchParams.append('q', query);
            baseURL.searchParams.append('response', "streaming");
            let reader = (await fetch(baseURL.href, {
                headers: new Headers({
                    'Authorization': 'Bearer 6ab69096-3bb4-422e-afc5-df032818b3c3', 
                }),
            })).body.getReader();

            let done = false;
            let value = null;

            while (!done) {
                let reading = await reader.read();
                done = reading.done;
                value = reading.value;

                if (!done) {
                    let str = (new TextDecoder().decode(value)).split("}{");
                    if (str.length > 1) {
                        str = "{"+str[str.length-1]
                    } else {
                        str = (new TextDecoder().decode(value));
                    }
                    console.log(str);
                    let res;
                    try {
                        res = JSON.parse(str).output;
                    } catch (_) {
                        continue
                    }
                    if (res) {
                        setQueryResults(res);
                    }

                } else {
                    setDone(true);
                }
            }
        }
        work();
    }, [query]);

    return (
        <div className="simon-result-scroll" style={{paddingBottom: "10px"}}>
            <div className={"simon-result-container " + styles.simon_result_container}
                 style={{display: (query) ? "block": "none", paddingTop: "20px"}}>
                <div className={"simon-result-answer " + styles.simon_result_answer}>
                    {queryResults.answer ? queryResults.answer.replace(/ ?\[\d+\]/g, ""): <div className="simon-no-results" style={{display: (query && isDone)?"block": "none"}}>{"No Results Found :("}</div>}
                </div>
                <br />

                <div className={"simon-result-links-container " +
                                styles.simon_result_links_container}>
                    {queryResults.search_results.map(({headline, resource}) => {
                        let link = resource.chunk.metadata.source;
                        let [before, after] = resource.chunk.text.split(resource.quote);
                        if (!after) 
                            after = "";
                        if (!before) 
                            before = "";
                        return (
                            <div className={"simon-result " +
                                            styles.simon_result}
                                 key={link+headline+resource.quote}>
                                <a href={link} className={"simon-headline "+styles.simon_headline}>{headline} <span className={"simon-link "+styles.simon_link}>{link}</span></a>
                                <div className={"simon-resource "+styles.simon_resource}>
                                    <span>{before.slice(-200)}</span> <span className={"simon-resource-quote "+styles.simon_resource_quote}>{resource.quote}</span><span>{after.slice(0,200)}</span></div>
                            </div>

                        );
                    })}
                </div>
            </div>

            {(isDone == false) ? <div className="simon-loadbox-alt" style={{fontStyle:"italic", color: "var(--darkgreen)"}}><div className="lds-facebook"><div></div><div></div><div></div></div> {"Digging through the wiki..."}</div> : <></>}
        </div>
    )
}

