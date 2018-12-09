let accessToken = '';
let userId = '';
let playlistID='';
const clientID = '48a9d52bbb8148e88009c595ce498aa1';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken () {
    if(accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if(accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    this.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  savePlaylist (playListName, trackURIs) {
    if(!playListName || !trackURIs) {
      return;
    }

    this.getAccessToken();

    fetch(`https://api.spotify.com/v1/me`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      if(jsonResponse.id) {
        userId=jsonResponse.id;

        if(userId) {

          fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: playListName})
          }).then(response => {
            if (response.ok) {
              return response.json();
            }
          }).then(jsonResponse => {
            if(jsonResponse.id) {
              playlistID = jsonResponse.id;

              if(playlistID){

                fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  },
                  method: 'POST',
                  body: JSON.stringify({uris: trackURIs})
                }).then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                }).then(jsonResponse => {

                });
              }
            }
          });
        }
      }
    });
  }
}

export default Spotify;
