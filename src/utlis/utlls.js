export function getIsLoggedIn() {
  const isLoggedin = localStorage.getItem(isLoggedin);
  return isLoggedin;
}

export function setIsLoggedIn(value) {
  localStorage.setItem("isLoggedin", value);
}

export async function addCompany(name, token, body) {
  const res = await fetch(
    "https://application-tracker.fastapicloud.dev/company",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
  const val = await res.json();
  if (res.ok) return val;
  if (res.status === 400)
    throw new Error("Error adding company. company present.");
  if (!res.ok) throw new Error("Error adding company");
}

export async function getAllCompanies() {
  const res = await fetch(
    "https://application-tracker.fastapicloud.dev/company",
    { method: "GET" },
  );
  const val = await res.json();
  if (!res.ok) return null;
  return val;
}

export async function getAllApplications(token) {
  const res = await fetch(
    "https://application-tracker.fastapicloud.dev/application/all/user",
    { method: "GET", headers: { Authorization: `Bearer ${token}` } },
  );
  const val = await res.json();
  if (res.ok) return val;
  return null;
}
