// randomly generates a number between the range of low and high
// arguments :
// low : number - the lowest number in the range
// high : number - the highest number in the range
export function getRandom(low:number=1, high:number=10) {
    let randomNumber:number;
    // calculate random number
    randomNumber = Math.round(Math.random() * (high - low)) + low;
    // returning value
    return randomNumber;
}

// adds key event listener to any key and runs a function when that key is pressed
// arguments :
// functionToCall : function - the function to call when the key is pressed
// keyToDetect : string - the key to detect
export function addKey(functionToCall:Function, keyToDetect:string = "Enter") {
    document.addEventListener("keydown", (e:KeyboardEvent) => {

        console.log("Key down: " + e.code);

        // is the key released the specified key?
        if (e.code === keyToDetect) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some older browsers
            return false;
        }
    });
}

// caches all images in the browser and runs a function when complete
// arguments :
// imageFilenames : array - the array of image filenames to load
// path : string - the path to the images in the project folder
// callback : function - the function to call when all images are loaded (optional)
let loadedCount:number, images:HTMLImageElement[];
export function cacheImages(imageFilenames:string[], path:string, callback:Function) {
    // initialization
    loadedCount = 0;
    images = [];
    
    // loop through array of image filenames
    for (let filename of imageFilenames) {
        // construct Image object and listen for when loaded
        let image:HTMLImageElement = new Image();
        image.addEventListener("load", (e:Event) => {
            loadedCount++;
            if (loadedCount >= imageFilenames.length) {
                if (callback) callback();
            }
        });
        image.src = path + filename;
        // save image in array so browser "caches" the image
        images.push(image);
    }
}

// retrieves JSON data from a URL and runs a function when the data is retrieved, passing along the JSON data as an argument
// arguments :
// retrieveURL : string - the URL to retrieve the JSON data from
// cacheExpiry : number|false - amount of time in seconds until the cached data becomes stale and needs to be re-fetched from data source. Set to 10 minutes by default. Set to 0 to disable caching. Set to false to disable caching and have data fetched once at build time. Only applies to server components - client components this is ignored
// debug : boolean - whether to throw an error if one occurs (default is set to true)
export async function getJSONData(retrieveScript:string, cacheExpiry:number|false = 600, debug:boolean = true) {
    try {
        const response:Response = await fetch(retrieveScript, { next: { revalidate: cacheExpiry }});
        const data:any = await response.json();
        return data;
    } catch (error:any) {
        console.log(`>>> FETCH ERROR: ${error.message}`);
        if (debug) throw error;
        return null;
    }
}

// sends JSON data to a URL and runs a function when the response has been received
// arguments :
// sendURL : string - the URL to send the JSON data to
// sendJSON : object - the JSON data to send
// requestType : string - the type of HTTP request to make (default is "POST")
// debug : boolean - whether to throw an error if one occurs (default is set to true)
export async function sendJSONData(sendURL: string, sendJSON: any, requestType:string = "POST", debug: boolean = true) {
    try {
        const response:Response = await fetch(sendURL, {
            method: requestType,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(sendJSON),
            cache: 'no-store'
        });
        const responseData:any = await response.json();
        return {data:responseData, status:response.status};
    } catch (error:any) {
        console.log(`>>> FETCH ERROR: ${error.message}`);
        if (debug) throw error;
        return null;
    }
}