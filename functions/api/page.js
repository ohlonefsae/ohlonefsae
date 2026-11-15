// functions/api/page.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const slug = url.searchParams.get('slug');

  if (!id && !slug) {
    return new Response(JSON.stringify({ error: 'Missing ID or slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let page;
    if (id) {
      page = await env.DB.prepare(
        `SELECT * FROM pages WHERE id = ? AND published = 1`
      ).bind(id).first();
    } else {
      page = await env.DB.prepare(
        `SELECT * FROM pages WHERE slug = ? AND published = 1`
      ).bind(slug).first();
    }

    if (!page) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(page), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
