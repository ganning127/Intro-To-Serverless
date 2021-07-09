let uri = undefined
const fetch = require('node-fetch');
const functions = require('./functions.js')

//if you wanna add more files, just put a comma after the filename (array)

uri = process.env.HACKERVOICE_ENDPOINT

functions.checkSecret(uri, "HACKERVOICE_ENDPOINT")

//If we have no query string then add one
//this allows us to append without error
uri = functions.queryString(uri)

try {
    (async () => {

        const uriWithQuery  = uri + "&password=letmein"

        const resp = await fetch(uriWithQuery, {
            method: 'GET'
        });

        functions.getStatus(resp, uri)

        var correct = await resp.text()

        const response = await fetch(uri + "&password=incorrect", {
            method: 'GET'
        });

        var incorrect = await response.text()

        try {
            if (correct == "Access granted." && incorrect == "Access denied.") {
                console.log("Yay! 🎉 You didn't let the bad guys in.")
            } else {
                console.log("Try again!")
                console.log(`We submitted "letmein" and got "${correct}", which should equal "Access granted."`)
                console.log(`We submitted "incorrect" and got "${incorrect}", which should equal "Access denied."`)
                process.exit(1)
            }
        } catch (e) {
            console.log("Are you sure you returned something to us? We didn't get anything. Try again!")
            process.exit(1)
        }

    })().catch( e => { console.error("Try again! We got this error when trying to make a request: " + e); process.exit(1) })
} catch (e) {
    throw new Error("You have not added your function url as a secret!");
}
