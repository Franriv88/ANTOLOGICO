export default function handler(req, res) {
  const { id_token, return_url } = req.query;

  if (!id_token || !return_url) {
    return res.status(400).send('Parámetros faltantes');
  }

  const sep = return_url.includes('?') ? '&' : '?';
  const targetUrl = return_url + sep + 'id_token=' + encodeURIComponent(id_token);

  res.setHeader('Location', targetUrl);
  res.status(302).end();
}
