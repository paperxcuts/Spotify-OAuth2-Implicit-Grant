const API_ENDPOINT = "https://api.spotify.com/v1";
const ACCESS_TOKEN = new URLSearchParams(window.location.href.split('#')[1]).get('access_token');
const AUTH_HEADER = new Headers({Authorization : `Bearer ${ACCESS_TOKEN}`});

const jsonprestring = json => `<pre>${JSON.stringify(json, null, 2)}</pre>`;

// const api_request = async url => await fetch(`${API_ENDPOINT}/${url}`, {headers: AUTH_HEADER}).then(res => res.json());

// get json data from response to GET request at API_ENDPOINT
async function api_request(url) {
    return await fetch(`${API_ENDPOINT}/${url}`, {headers: AUTH_HEADER})
    .then(res => ({ data : res.json(), response : res.status}))
    .catch(err => console.log(err));
}

// simplified, filtered representation of data
async function filterPlaylistsJson()
{
    return await api_request('me/playlists')
    .then(res => {
        const playlists = [];
        res.data.items.forEach(val => {
            playlists.push({
                name: val.name,
                songs: val.tracks.total,
                id: val.id,
                owner: val.owner.display_name
            });
        });
        return playlists;
    })
    .catch(err => console.log(err));
}
async function filterTracksJson(playlist_id)
{
    return await api_request(`playlists/${playlist_id}/tracks`)
    .then(res => {
        const all_tracks = {
            total_tracks: res.data.total,
            tracks: []
        };
        res.data.items.forEach(val => {
            const track = val.track;
            all_tracks.tracks.push({
                name: track.name,
                artist: track.artists.length == 1 ? track.artists[0].name : track.artists.map(album => album.name),
                album: track.album.name,
                date_added: val.added_at
            });
        });
        return all_tracks;
    })
    .catch(err => console.log(err));
}


function displayPlaylistTracks()
{
    const playlist_id = $('#playlist-id').val();
    if(playlist_id.length === 0) {
        console.warn('playlist id must be present');
        return;
    }
    filterTracksJson(playlist_id)
    .then(res => {
        $('#track-output').append(jsonprestring(res));
    })
    .catch(err => console.log(err));
}
function displayUserPlaylists()
{
    filterPlaylistsJson()
    .then(res => {
        const output = $('#playlist-output');
        output.empty();
        output.append(jsonprestring(res));
    })
    .catch(err => console.log(err));
}
function displayUserInfo()
{
    api_request('me')
    .then(res => {
        $('#id').text(`id: ${res.data.id}`);
        $('#followers').text(`followers: ${res.data.followers.total}`);
    })
    .catch(err => console.log(err));
}
function displayUserRequest()
{
    const url = $('#request-input').val();
    if(url.length === 0) {
        console.warn('input must not be empty');
        return;
    }
    
    const output = $('#request-output');
    
    output.empty();
    api_request(url)
    .then(res => {
        output.append(jsonprestring(res.data));                
    })
    .catch(err => console.log(err));
}


// append endpoint to before textbox
$('#request-prefix').prepend(`${API_ENDPOINT}/`);

$('#display-user-info').click(displayUserInfo);

// user requests
$('#submit-request').click(displayUserRequest);
$('#clear-requests').click(() => $('#request-output').empty());        

// playlists
$('#clear-playlists').click(() => $('#playlist-output').empty());
$('#display-playlists').click(displayUserPlaylists);

// tracks
$('#clear-tracks').click(() => $('#track-output').empty());
$('#display-tracks').click(displayPlaylistTracks);
