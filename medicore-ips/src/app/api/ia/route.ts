import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key || key.includes('pon-tu-key')) {
    return NextResponse.json({ error: 'API_KEY_NOT_CONFIGURED' }, { status: 503 })
  }
  try {
    const client = new Anthropic({ apiKey: key })
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'Eres un asistente clínico biomédico especializado en gestión hospitalaria colombiana. Respondes de manera concisa, técnica y precisa. Conoces la normativa: Decreto 4725/2005, Res. 3100/2019, Ley 1581/2012, ISO 13485, ISO 55001, INVIMA, Res. 2275/2023, Res. 042/2020 DIAN, SOGCS.',
      messages: [{ role: 'user', content: message }],
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'Error al consultar la IA' }, { status: 500 })
  }
}
