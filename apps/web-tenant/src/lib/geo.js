export async function detectGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const d = await res.json();
    return {
      pais: d.country_name ?? null,
      paisCode: d.country_code ?? null,
      provincia: d.region ?? null,
      ciudad: d.city ?? null,
      lat: d.latitude ?? null,
      lng: d.longitude ?? null,
    };
  } catch {
    return null;
  }
}
