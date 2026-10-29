// ============================================================
// Cloudflare Workers 入口（静态资源模式）
//
// 分工：
//   /api/*  → 反代到 BACKEND_ORIGIN（Render 后端）
//   其余    → 交给 env.ASSETS 静态资源（dist/，SPA 兜底由 wrangler 的
//             not_found_handling 负责）
//
// 与 Pages 版 frontend/functions/api/[[path]].js 是同一套逻辑的两份实现，
// 保留两份是因为 Pages 用 onRequest 导出、Workers 用 fetch 导出，无法共用。
// 本项目实际部署走 Workers（Dashboard 里有 "部署命令 npx wrangler deploy"），
// 这份才是生效的；Pages 版留着以备切回 Pages。
//
// 后端域名改哪里：frontend/wrangler.jsonc 的 vars.BACKEND_ORIGIN
// ============================================================

const DROP_HEADERS = [
  'host',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-ray',
  'cf-visitor',
  'x-forwarded-host',
]

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 非 /api 请求直接走静态资源
    if (!url.pathname.startsWith('/api/') && url.pathname !== '/api') {
      return env.ASSETS.fetch(request)
    }

    const origin = (env.BACKEND_ORIGIN || '').trim().replace(/\/+$/, '')
    if (!origin) {
      return json(500, {
        code: 500,
        message:
          'BACKEND_ORIGIN 未配置：请在 frontend/wrangler.jsonc 的 vars 里填写后端地址',
      })
    }

    const target = origin + url.pathname + url.search

    const headers = new Headers(request.headers)
    for (const h of DROP_HEADERS) headers.delete(h)

    const init = {
      method: request.method,
      headers,
      redirect: 'manual',
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // 流式转发：附件上传不整包读入内存
      init.body = request.body
    }

    let resp
    try {
      resp = await fetch(target, init)
    } catch (e) {
      return json(502, {
        code: 502,
        message: `后端不可达（${origin}）：${
          e && e.message ? e.message : '未知错误'
        }。免费实例可能正在冷启动，请 30 秒后重试`,
      })
    }

    const out = new Headers(resp.headers)
    // Workers 已自动解压，保留这些头会让浏览器解析失败
    out.delete('content-encoding')
    out.delete('content-length')
    out.delete('transfer-encoding')

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: out,
    })
  },
}
