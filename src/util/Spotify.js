const accessToken = '';
const clientID = '8ae08515175e43babb9d114ba8ec4477';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken () {
    if(accessToken) {
      console.log('token already exists');
      return accessToken;
    } else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log('Access token extracted from URI');
    } else {
      window.location=`https://accounts.spotify.com/authorize?client_id=${clientID}}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      console.log('Trying final option to access token');
    }
  },
  search(term) {
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
