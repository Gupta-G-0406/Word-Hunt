import React, { useState, useEffect } from "react";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import "../styles/Dictionary.css";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function Dictionary(props) {
  const [keyword, setKeyword] = useState(props.defaultKeyword);
  const [results, setResults] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [words, setWords] = useState("");

  const inputLanguage = "En";
  const outputLanguage = "Hi";
  const API_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    keyword
  )}`;

  async function fetchProductData() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setWords(data[0][0][0]);
    } catch (error) {
      console.log("Error aagya ji");
      setWords("");
    }
  }
  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    search();
  }, []);

  function handlePexelsResponse(response) {
    setPhotos(response.data.photos);
  }

  function handleDictionaryResponse(response) {
    setResults(response.data[0]);
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  function search() {
    if (transcript.length > 0) {
      setKeyword(transcript);
    }
    const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
    const pexelsApiKey =
      "GoBQqPHxl4GB3PQJ8lbBFmL30GMsnWjIuY5AyCq7EbiqtF0zsyL8Pxru";
    const pexelsApiUrl = `https://api.pexels.com/v1/search?query=${keyword}&per_page=9`;
    const pexelsApiHeaders = { Authorization: pexelsApiKey };

    axios.get(dictionaryApiUrl).then(handleDictionaryResponse);
    axios
      .get(pexelsApiUrl, { headers: pexelsApiHeaders })
      .then(handlePexelsResponse);
    fetchProductData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  useEffect(() => {
    if (loaded) {
      search();
    }
  }, [loaded]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="Dictionary">
      {loaded ? (
        <section>
          <div className="subheading">What word piques your interest?</div>
          <form onSubmit={handleSubmit}>
            {/* <input
              className="search"
              type="search"
              // value={transcript}
              onChange={handleKeywordChange}
              placeholder={props.defaultKeyword}
            /> */}

            {transcript ? (
              <input
                className="search"
                type="search"
                onChange={handleKeywordChange}
                placeholder={transcript}
              />
            ) : (
              <input
                className="search"
                type="search"
                onChange={handleKeywordChange}
                placeholder={keyword}
              />
            )}

            <div className="button">
              <p>
                {listening ? (
                  <button onClick={SpeechRecognition.stopListening}>
                    <FaMicrophoneSlash />
                  </button>
                ) : (
                  <button onClick={SpeechRecognition.startListening}>
                    <FaMicrophone />
                  </button>
                )}
              </p>
            </div>
            <input
              type="submit"
              value="Search"
              className="search-button"
              onClick={handleSubmit}
            />
          </form>
          <div className="suggestions">
            Suggested concepts: biodiversity, quantum mechanics,
            sustainability...
          </div>
          <br />
          <div className="hindi">हिंदी - अर्थ :: {words}</div>
        </section>
      ) : (
        "Searching..."
      )}
      {results && <Results results={results} />}
      {photos && <Photos photos={photos} />}
    </div>
  );
}
