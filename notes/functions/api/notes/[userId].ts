// Cloudflare Pages Function for notes operations per user
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = context.params.userId as string;

  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC'
    )
      .bind(userId)
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        notes: results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = context.params.userId as string;
  const { title, content } = await context.request.json();

  try {
    const result = await context.env.DB.prepare(
      'INSERT INTO notes (user_id, title, content, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))'
    )
      .bind(userId, title, content)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        note: {
          id: result.meta.last_row_id,
          user_id: userId,
          title,
          content
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
