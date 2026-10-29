// ============================================================
// Cloudflare Pages Function：/api/* → 后端 Origin 同域反代
// 作用：前端与接口同域，天然无 CORS；后端换域名只改环境变量
// 配置：Pages 项目 Settings → Environment variables 增加
//       BACKEND_ORIGIN = https://<你的后端域名>   （不带结尾斜杠，不含 /api）
// ============================================================

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export async function onRequest(context) {
  const { request, env } = context
  const origin = (env.BACKEND_ORIGIN || '').trim().replace(/\/+$/, '')

  if (!origin) {
    return json(500, {
      code: 500,
      message: 'BACKEND_ORIGIN 未配置：请在 Cloudflare Pages 环境变量里填写后端地址',
    })
  }

  const url = new URL(request.url)
  const target = origin + url.pathname + url.search

  // 复制请求头，剔除 Cloudflare/浏览器侧不应透传的头
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('cf-connecting-ip')
  headers.delete('cf-ipcountry')
  headers.delete('cf-ray')
  headers.delete('cf-visitor')
  headers.delete('x-forwarded-host')

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // 流式转发（文件上传不会整包读进内存）
    init.body = request.body
  }

  let resp
  try {
    resp = await fetch(target, init)
  } catch (e) {
    return json(502, {
      code: 502,
      message: `后端不可达（${origin}）：${e && e.message ? e.message : '未知错误'}。免费实例可能正在冷启动，请 30 秒后重试`,
    })
  }

  const out = new Headers(resp.headers)
  // Workers 已自动解压，保留这些头会导致浏览器解析失败
  out.delete('content-encoding')
  out.delete('content-length')
  out.delete('transfer-encoding')

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: out,
  })
}
