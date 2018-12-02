import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';

const searchRes1 = {name: 'Yellow Submarine', artist: 'Beatles', album: 'Best of the Beatles', id: '1'};
const searchRes2 = {name: 'Red Submarine', artist: 'Beatles', album: 'Best of the Beatles', id: '2'};
const searchRes3 = {name: 'Purple Submarine', artist: 'Beatles', album: 'Best of the Beatles', id: '3'};

const playlistTrack1 = {name: 'Cassandra', artist: 'ABBA', album: 'Best of ABBA', id: '11'};
const playlistTrack2 = {name: 'Barcelona', artist: 'ABBA', album: 'Best of ABBA', id: '12'};

class App extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
                searchResults: [searchRes1, searchRes2, searchRes3],
                playlistName: 'Best of the Beatles',
                playlistTracks: [playlistTrack1,playlistTrack2]
                };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id===track.id)) {
        return;
    }
    const newplaylistTracks = this.state.playlistTracks;
    newplaylistTracks.push(track);
    this.setState({playlistTracks: newplaylistTracks});
  }

  removeTrack(track) {
    const newplaylistTracks = this.state.playlistTracks.filter(savedTrack => {
      return savedTrack.id !== track.id;
    })
    this.setState({playlistTracks: newplaylistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(savedTrack => {
      return `spotify:track:${savedTrack}`
    })
  }

  search(searchTerm) {
    console.log(searchTerm);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
