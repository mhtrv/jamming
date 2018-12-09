let accessToken = '';
let userId = '';
let playlistID='';
const clientID = '48a9d52bbb8148e88009c595ce498aa1';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken () {
    if(accessToken) {
      console.log('token already exists');
      return accessToken;
    }

  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

  if(accessTokenMatch && expiresInMatch) {
      console.log('Access token extracted from URI');
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      console.log(expiresIn);
      Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;

    } else {
      console.log('Trying final option to access token');
      //const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      //window.location = accessUrl;
      window.location=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
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
      if (response.ok) {
        console.log ('response is OK');
        return response.json();
      }
    }).then(jsonResponse => {
        console.log(jsonResponse);
        if(jsonResponse.tracks) {
          console.log (jsonResponse.tracks);
          return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
          }));
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
            console.log ('response is OK');
            return response.json();
          }
          console.log('Request failed while obtaining user id');
        }).then(jsonResponse => {
            console.log(jsonResponse);
            if(jsonResponse.id) {
              userId=jsonResponse.id;
              console.log (userId);
              //return userId;

              if(userId) {
                console.log('Successfully obtained userId now creating playList');

                fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({name: playListName})
                }).then(response => {
                  if (response.ok) {
                    console.log ('Create playlist response is OK');
                    return response.json();
                  }
                  console.log(response);
                }).then(jsonResponse => {
                    console.log('json response after creating playlist');
                    if(jsonResponse.id) {
                      playlistID = jsonResponse.id;
                      console.log(`playlistID is ${playlistID}`);

                      if(playlistID){
                        console.log(JSON.stringify({uris: trackURIs}));
                        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              'Content-Type': 'application/json'
                            },
                            method: 'PUT',
                            body: JSON.stringify({uris: trackURIs})
                        }).then(response => {
                          if (response.ok) {
                            console.log ('Successfully added tracks to playList');
                            return response.json();
                          }
                          console.log(response);
                        }).then(jsonResponse => {
                            console.log('json response after adding tracks to playlist');
                        });
                      } else {
                        console.log(`playlistID is empty ${playlistID}`);
                      }

                    }
                });
              }

            }
        });





  }

}

export default Spotify;
