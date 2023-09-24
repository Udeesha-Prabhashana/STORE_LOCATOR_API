const storeForm = document.getElementById("store-form");
const storeAddress = document.getElementById("store-address");

// Send POST to API to add store
async function addStore(e) {
  e.preventDefault();

  if (storeAddress.value === "") {
    alert("Please fill in fields");
  }

  const sendBody = {
    address: storeAddress.value
  };

  try {
    const res = await fetch("/api/v1/stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });

    if (res.status === 400) {
      throw Error("Store already exists!");
    }

    alert("Store added!");
    window.location.href = "/index.html";
  } catch (err) {
    alert(err);
    return;
  }
}

storeForm.addEventListener("submit", addStore);
