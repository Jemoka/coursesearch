"use client";

// react stuff
import { useState, useEffect, useRef } from 'react';

// stylistic handling
import styles from "./search.module.css";

// import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

// tooling
import editDistance from "./levenshtein.js";

// api
function useSuggest(query) {
    let finalURL = null;
    try {
        let baseURL = new URL("/autocomplete", "https://beta.api.simon.shabang.io");
        baseURL.searchParams.append('q', query);

        finalURL = baseURL.href;
        if (query == "" || !query) {
            finalURL = null; // swr pauses if key is null
        }
    } catch (e) {}

    const { data, error, isLoading } =  useSWRImmutable(finalURL, async (path) => {
        let res = await (await (fetch(path, {
            headers: new Headers({
                'Authorization': 'Bearer stanford-2324', 
            })
        }))).json();
        return res.response;
    });

    return {
        suggestResults: data,
        suggestLoading: isLoading,
        suggestError: error
    };
}

export default function SearchBar({dispatch}) {
    // UI things
    const [query, setQuery] = useState("");
    const [textBoxFocused, setTextBoxFocused] = useState(false);
    const [lastDispatch, setLastDispatch] = useState("");
    const [editToast, setEditToast] = useState(false);
    const lastEdit = useRef(null);
    const [highlighted, setHighlighted] = useState(-1);

    // simon things
    const { suggestResults, suggestLoading, suggestError } = useSuggest(lastDispatch);

    const dispatchHandler = (e) => {
        // have a small time delay to do this in order to
        // support onclick event fireing
        setTextBoxFocused(false);
        setEditToast(false);
        if (dispatch) {
            dispatch(e);
        }
    };

    useEffect(() => {
        // edit distance based dispatch rule
        // if (editDistance(lastDispatch, query) >= 15) setLastDispatch(query); 

        // timeout based dispatch rule
        if (lastEdit.current) clearTimeout(lastEdit.current);
        setEditToast(false);
        lastEdit.current = setTimeout(() => {
            setLastDispatch(query);
        }, 500);
    }, [query]);

    useEffect(() => {
        if (query.trim() != "" && textBoxFocused) {
            setEditToast(true);
        }
    }, [lastDispatch]);

    return (
        <div className={"simon-search-container " + styles.simon_search_container}>

            <input className={"simon-search-bar " + styles.simon_search_bar}
                   inputmode="search"
                   value={query} placeholder={"Ask me anything..."}
                   onKeyDown={(e) => {
                       if (e.key == "ArrowDown") {
                           setHighlighted(Math.min(highlighted+1,
                                                   suggestResults ?
                                                   suggestResults.length-1 : 0));
                           e.preventDefault();
                       } else if (e.key == "ArrowUp") {
                           setHighlighted(Math.max(highlighted-1,-1));
                           e.preventDefault();
                       } else if (e.key == "Enter") {
                           if (highlighted != -1) {
                               dispatchHandler(suggestResults[highlighted]);
                               setQuery(suggestResults[highlighted]);
                               e.target.value = suggestResults[highlighted];
                               setHighlighted(-1);
                           } else dispatchHandler(query);
                           e.target.blur();
                       } else {
                           setHighlighted(-1);
                       }

                       setQuery(e.target.value);
                   }}
                   onChange={(e) => setQuery(e.target.value)}
                   onFocus={() => {
                       if (query.trim() != "") {
                           setEditToast(true);
                       }
                       setTextBoxFocused(true);
                   }}
                   onBlur={(e) => {
                       if (!(e.nativeEvent.explicitOriginalTarget.className && e.nativeEvent.explicitOriginalTarget.className.includes("simon-search-popup-item"))) {
                           setTextBoxFocused(false);
                       }
                       setEditToast(false);
                   }}
            />
            <span className={styles.simon_search_toast}
                  style={{opacity: editToast ? 1 : 0,
                          cursor: "pointer"}}
                  onClick={() => {
                      dispatchHandler(query);
                  }}>
                <i className="fa-solid fa-magnifying-glass" /> {"Enter"}</span>

            <ul className={"simon-search-popup " + styles.simon_search_popup}
                style={{display: textBoxFocused ? "block" : "none",
                        opacity: textBoxFocused ? 1 : 0}}>
                {(() => {
                    if (suggestLoading || !suggestResults || suggestResults.length == 0) return (
                        <div className={"simon-search-loading " +
                                        styles.simon_search_loading}>{suggestLoading ? "Postulating...": "Go ahead, type something!"}</div>
                    );
                    else return suggestResults.map((text, i) => 
                        <li className={"simon-search-popup-item " +
                                       styles.simon_search_popup_item}
                            style={{backgroundColor: i==highlighted ?
                                    "var(--offwhite)" : "inherit"}}
                        key={text}
                            onClick={(e) => {
                                setHighlighted(-1);
                                setQuery(text);
                                setEditToast(false);
                                dispatchHandler(text.split(":")[0].trim());
                            }}>{text.split(":")[0].trim()}</li>
                    );
                })()}
            </ul>
        </div>
    );
}
