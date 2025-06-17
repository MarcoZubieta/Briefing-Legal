
document.getElementById("githubSubmitButton").addEventListener("click", async function (e) {
    e.preventDefault();

    const form = document.getElementById("briefingForm");
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    });

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyLKU9oKoM6y8MOhEefSgJ5LpuWnGo2LThbQ8yDXplcbdXfvUZMgU5frJcKkuWw-pOG/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error en el servidor");

        const result = await response.json();
        document.getElementById("statusMessage").innerText = "✅ Briefing enviado exitosamente.";
    } catch (error) {
        document.getElementById("statusMessage").innerText = "❌ Error al enviar el briefing.";
        console.error(error);
    }
});
