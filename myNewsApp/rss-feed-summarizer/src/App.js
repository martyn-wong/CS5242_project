// App.js
import React, { useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

function App() {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleFetchFeed = async () => {
    try {
      const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const result = await xml2js.parseStringPromise(response.data.contents, { mergeAttrs: true });
      const items = result.rss.channel[0].item;
      const feedSummaries = items.map(item => ({
        title: item.title[0],
        summary: item.description[0]
      }));
      setSummaries(feedSummaries);
    } catch (error) {
      console.error('Error fetching or parsing the feed:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#151B54', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>RSS Feed Summarizer</h1>
      <input type="text" value={url} onChange={handleInputChange} placeholder="Enter RSS feed URL" />
      <button onClick={handleFetchFeed}>Fetch Feed</button>
      {summaries.map((summary, index) => (
        <div key={index}>
          <h2>{summary.title}</h2>
          <p>{summary.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
