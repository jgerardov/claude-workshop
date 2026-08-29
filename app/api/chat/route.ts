import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { REGLAS_AGENTE } from '@/lib/knowledge'
import { Analisis, Perfil } from '@/lib/types'

export const runtime = 'nodejs'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function systemPrompt(perfil: Perfil, analisis: Analisis) {
  return [
    'Eres el asesor financiero y fiscal de una PyME mexicana dentro de este producto.',
    REGLAS_AGENTE,
    'Perfil del negocio (JSON):',
    JSON.stringify(perfil),
    'Análisis ya calculado por el motor de reglas de la app (JSON, no lo recalcules, solo interprétalo):',
    JSON.stringify(analisis),
  ].join('\n\n')
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.CLAUDE_API
  if (!apiKey) {
    return NextResponse.json({ error: 'Falta configurar CLAUDE_API en .env.local' }, { status: 500 })
  }

  const body = await req.json().catch(() => null) as { perfil?: Perfil; analisis?: Analisis; mensajes?: ChatMessage[] } | null
  if (!body?.perfil || !body?.analisis || !body?.mensajes) {
    return NextResponse.json({ error: 'Falta perfil, analisis o mensajes en la solicitud' }, { status: 400 })
  }

  try {
    const anthropic = new Anthropic({ apiKey })
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 700,
      system: systemPrompt(body.perfil, body.analisis),
      messages: body.mensajes.map((m) => ({ role: m.role, content: m.content })),
    })

    const texto = response.content.find((b) => b.type === 'text')?.text ?? ''
    return NextResponse.json({ reply: texto })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'No se pudo contactar al asesor de IA. Intenta de nuevo.' }, { status: 502 })
  }
}
