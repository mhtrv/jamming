const accessToken = '';
const clientID = '48a9d52bbb8148e88009c595ce498aa1';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken () {
    if(accessToken) {
      console.log('token already exists');
      return accessToken;
    } else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      console.log('Access token extracted from URI');
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      console.log('Trying final option to access token');
      window.location=`https://accounts.spotify.com/authorize?client_id=${clientID}}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },
  search(term) {
    this.getAccessToken();
    console.log('successfully ran getAccessToken');
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if(jsonResponse.tracks) {
          return jsonResponse.tracks.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }
          }
        )}
    });
  }
}

export default Spotify;
