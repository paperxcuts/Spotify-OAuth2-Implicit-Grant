const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';

const queryString = {
    // client_id,
    // response_type: 'token',
    // redirect_uri,
    // scope
}

function updateQuery()
{
    const client_id = $('#client-id').val();
    const redirect_uri = $('#redirect').val();
    const scopes = $('#scopes').val();


    if(client_id.length === 0)
        return false;
    if(redirect_uri.length === 0)
        return false;
    
    queryString.client_id = client_id;
    queryString.response_type = 'token';
    queryString.redirect_uri = redirect_uri;
    
    if(scopes.length !== 0)
        queryString.scope = scopes;
    
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
    
    $('#link').attr('href', urlStr).text(urlStr);
}

$('#get-link').click(buildLink);
