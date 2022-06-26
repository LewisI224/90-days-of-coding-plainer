module.exports = async (req, res) => {
    const data = req.body
    try {

        // set up options
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'apiKey': process.env.KIWI_API_KEY
            }
        }

        // query the locations api to get a departure ID
        const locationsURL = `https://tequila-api.kiwi.com/locations/query?term=${data.departure}&locale=en-US&location_types=airport&limit=1&active_only=true`;
        const departureResponse = await fetch(locationsURL, options);
        const departureResult = await departureResponse.json();
        if (departureResult.locations[0] == undefined) {
            const error = new Error("Departure Airport Does Not Exist");
            throw error;
        }
        const departureID = departureResult.locations[0].id;
        
        // find a destination for the user
        const userChoice = data.holidayType;
        

        //convert user input into a usable format
        var date = new Date((data.month));
        //build the url to search for flights
        const url =`https://tequila-api.kiwi.com/v2/search?fly_from=${departureID}&fly_to=${data.destination}&dateFrom=01/${date.getMonth()+1}/${date.getFullYear()}&dateTo=28/${date.getMonth()+1}/${date.getFullYear()}&return_from=01/${date.getMonth()+1}/${date.getFullYear()}&return_to=28/${date.getMonth()+1}/${date.getFullYear()}&curr=GBP&max_stopovers=0&nights_in_dst_from=${data.days}&nights_in_dst_to=${data.days}&adults=${data.people}&selected_cabins=${data.class}&price_from=0&price_to=${data.budget}&limit=10`
        const response = await fetch(url, options);
        const result = await response.json();
        res.status(200);
        res.end(JSON.stringify(result))

    } catch(error) {
        res.json({error: error.message});

    }
}