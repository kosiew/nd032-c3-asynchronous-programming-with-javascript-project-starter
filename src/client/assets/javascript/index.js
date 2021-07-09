// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
var store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}

const d = (function () {
	const debug = true;

	function log(message, level=0) {
		if (debug) {
			const styles = [
				'border: 1px solid #3E0E02'
				, 'color: white'
				, 'display: block'
				, 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
				, 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
				, 'line-height: 20px'
				, 'text-align: center'
				, 'font-weight: bold'
			];
	
			if (level==0) {
				styles.push('background: linear-gradient(#060dd3, #040647)');
			} else {
				styles.push('background: linear-gradient(#D33106, #571402)');
			}
			
			const _styles = styles.join(';');
			console.log(`%c ${message}`, _styles);
		}
	}

	function group(groupName = 'default') {
		if (debug) {
			console.group(groupName);
		}
	}

	function groupEnd() {
		if (debug) {
			console.groupEnd();
		}
	}

	function table(obj) {
		if (debug) {
			console.table(obj);
		}
	}
		
	return {
		log: log,
		group: group,
		groupEnd: groupEnd,
		table: table

	};
})();



const updateStore = (store, newState) => {
    d.group('updateStore');
    d.table(newState);
    store = Object.assign(store, newState)
    d.groupEnd();
}

function updateHOF(store) {
    return function(newState) {
		d.group('updateStore');
		d.table(newState);
        updateStore(store, newState);
		d.groupEnd();
    }
}

const updateStoreHOF = updateHOF(store);


// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	d.group('dom loaded');
	onPageLoad()
	setupClickHandlers()
	d.groupEnd();
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
				updateStoreHOF({'tracks': tracks});
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html);
				updateStoreHOF({'racers': racers});
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	d.log('setupClickHandler');
	document.addEventListener('click', function(event) {
		const { target } = event;

		d.group('clickHandler');
		d.group('click target');
		const classList = target.classList;
		d.table(classList);
		d.groupEnd();
		// Race track form field
		if (target.matches('.card.track')) {
			d.log('selectTrack');
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			d.log('selectRacer');
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			d.log('createRace');
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			d.log('accelerate');
			handleAccelerate(target)
		}
		d.groupEnd();

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	// render starting UI
	const {track_id, races, player_id} = store;
	const tracks = store.tracks;
	const track = {...tracks[track_id]}; 
	renderAt('#race', renderRaceStartView(track, races));

	// TODO - Get player_id and track_id from the store
	
	// const race = TODO - invoke the API call to create the race, then save the result
	const race = await createRace(player_id, track_id);
	d.group('created race');
	d.table(race);
	const raceId = parseInt(race.ID) - 1;
	// TODO - update the store with the race id
	updateStoreHOF({'race_id': raceId});
	d.groupEnd();
	// The race has been created, now start the countdown
	// TODO - call the async function runCountdown
	await runCountdown();

	// TODO - call the async function startRace
	await startRace(raceId);	
	// TODO - call the async function runRace
	await runRace(raceId);
}

function runRace(raceID) {
	return new Promise(resolve => {
	// TODO - use Javascript's built in setInterval method to get race info every 500ms

	/* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:

		renderAt('#leaderBoard', raceProgress(res.positions))
	*/

	/* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		reslove(res) // resolve the promise
	*/
	})
	// remember to add error handling for the Promise
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second

			const loop = setInterval(
				() => {
					document.getElementById('big-numbers').innerHTML = --timer;
					if (timer == 0) {
						clearInterval(loop);
						resolve();
					}
				},
				1000
			);
			// run this DOM manipulation to decrement the countdown for the user
			// TODO - if the countdown is done, clear the interval, resolve the promise, and return

		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	d.log("selected pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	updateStoreHOF({'player_id': target.id});
}

function handleSelectTrack(target) {
	d.log("selected track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected track id to the store

	updateStoreHOF({'track_id': target.id});
	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// TODO - Invoke the API call to accelerate
	const {racer_id} = store;
	accelerate(racer_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function getUrl(server) {
	return (endpoint) => {
		return `${server}/api/${endpoint}`;
	}
}

const url = getUrl(SERVER);


function getApi(endpoint) {
	d.log(`getApi ${endpoint}`);
	const urlEndpoint = url(endpoint);
	return fetch(urlEndpoint)
	    .then(response => response.json())
		.catch(err => console.log(`Problem with ${endpoint} request:`, err));
}


function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	const endpoint = 'tracks';
	return getApi(endpoint);
}

function getRacers() {
	// GET request to `${SERVER}/api/cars`
	const endpoint = 'cars';
	return getApi(endpoint);
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log(`Problem with createRace request:: player_id ${player_id} track_id ${track_id}`, err))
}

function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	const endpoint = 'races/${id}';
	return getApi(endpoint);
}

function startRace(id) {
	d.log('startRace');
	d.table(store);
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log(`Problem with startRace request:: id ${id}`, err))
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log(`Problem with accelerate request:: id ${id}`, err))
}
