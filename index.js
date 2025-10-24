/**
 * @typedef Party
 * @property {number} id
 * @property {string} name
 * @property {string} date
 * @property {string} description
 * @property {string} location
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "2509-pt-mac";
const RESOURCE = "/events";
const API = `${BASE}/${COHORT}${RESOURCE}`;

// === State ===
let parties = [];
let selectedParty;

// === Fetch Functions ===
async function getParties() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    parties = data.data;
  } catch (err) {
    console.error("Error fetching parties:", err);
  }
}

async function getParty(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const data = await response.json();
    selectedParty = data.data;
    render();
  } catch (err) {
    console.error("Error fetching party:", err);
  }
}

// === Components ===
function PartyListItem(party) {
  const $li = document.createElement("li");
  const $a = document.createElement("a");
  $a.href = "#selected";
  $a.textContent = party.name;
  $a.addEventListener("click", () => getParty(party.id));
  $li.appendChild($a);
  return $li;
}

function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  parties.forEach((party) => {
    $ul.append(PartyListItem(party));
  });

  return $ul;
}

function PartyDetails() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn details.";
    return $p;
  }

  const $div = document.createElement("div");
  $div.classList.add("party-details");

  // Format the date nicely
  const formattedDate = new Date(selectedParty.date).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  $div.innerHTML = `
    <h3>${selectedParty.name} (ID: ${selectedParty.id})</h3>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Location:</strong> ${selectedParty.location}</p>
    <p>${selectedParty.description}</p>
  `;

  return $div;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("PartyDetails").replaceWith(PartyDetails());
}

// === Init ===
async function init() {
  await getParties();
  render();
}

init();
