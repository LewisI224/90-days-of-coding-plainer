module.exports = async (req, res) => {
    try {

        // get an access token
        const accessURL = 'https://test.api.amadeus.com/v1/security/oauth2/token'

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");
        urlencoded.append("client_id", "9vwpC4ZeanO3U9tN3Tyaf68aaAOHTGiH");
        urlencoded.append("client_secret", "Nj7C7Tm6aYzte8Ak");

        const accessOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded
        };
        const tokenResponse = await fetch(accessURL, accessOptions);
        const tokenResult = await tokenResponse.json();
        const accessToken = tokenResult.access_token;
        // set up options
        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };
        const url =`https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=${req.body.code}`;
        
        const response = await fetch(url, options);
        const result = await response.json();
        res.status(200);
        res.end(JSON.stringify(result));

    } catch(error) {
        res.json({error: error.message});

    }
}