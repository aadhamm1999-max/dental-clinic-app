async function addPatient() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const notes = document.getElementById("notes").value;

  await fetch("/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, phone, age, notes })
  });

  loadPatients();
}

async function loadPatients() {
  const res = await fetch("/api/patients");
  const data = await res.json();

  const container = document.getElementById("patients");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `<p>${p.name}</p>`;
  });
}

loadPatients();
