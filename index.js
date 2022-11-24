const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';

const client_id = document.getElementById('client_id');
const redirect = document.getElementById('redirect');
const scopes = document.getElementById('scopes');

const linkbutton = document.getElementById('get_link');

const queryString = {
    // client_id : null,
    // response_type: 'token',
    // redirect_uri : null,
    // scope : null
}

function updateQuery()
{
    if(client_id.value.length === 0)
        return false;
    if(redirect.value.length === 0)
        return false;
    
    queryString.client_id = client_id.value;
    queryString.response_type = 'token';
    queryString.redirect_uri = redirect.value;
    
    if(scopes.value !== '')
        queryString.scope = scopes.value;
    
    return true;
}
function buildLink() {

    if(!updateQuery()) {
        console.warn('missing input!');
        return;
    }
    const url = new URL(AUTH_ENDPOINT);
    url.search = new URLSearchParams(queryString);
    const urlStr = url.toString();
    
    const link = document.getElementById('link');
    link.href = urlStr;
    link.textContent = urlStr;
}

linkbutton.addEventListener('click', buildLink);