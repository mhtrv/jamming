import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';

const searchRes = {name: 'Yellow Submarine', artist: 'Beatles', album: 'Best of the Beatles', id: '1'};
const playlistTrack = {name: 'Cassandra', artist: 'ABBA', album: 'Best of ABBA', id: '11'};

class App extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
                searchResults: [searchRes, searchRes, searchRes],
                playlistName: 'Best of the beatles',
                playlistTracks: [playlistTrack,playlistTrack]
                };

    this.addTrack = this.addTrack.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id===track.id)) {
        return;
    }
    this.state.playlistTracks.push(track);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
