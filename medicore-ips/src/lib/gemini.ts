export interface MensajeGemini {
  role: 'user' | 'model'
  parts: { text: string }[]
}

const SYSTEM_PROMPT = `Eres el asistente clínico de MediCore IPS, sistema de gestión integral para IPS colombianas. Ayudas con protocolos clínicos, normativa colombiana de salud (Res. 3100/2019, Decreto 4725/2005, Ley 1581/2012, Res. 2275/2023), gestión biomédica y tecnovigilancia. Responde siempre en español colombiano, conciso y preciso.`

export async function consultarGemini(
  mensaje: string,
  historial: MensajeGemini[] = []
): Promise<string> {
  try {
    const messages = [
      ...historial
        .filter(m => m.role === 'user' || m.role === 'model')
        .slice(-8)
        .map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.parts[0].text,
        })),
      { role: 'user', content: mensaje },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (response.status === 401) {
      return await consultarSinKey(mensaje)
    }

    if (!response.ok) {
      return await consultarSinKey(mensaje)
    }

    const data = await response.json()
    return data.content?.[0]?.text || await consultarSinKey(mensaje)
  } catch {
    return await consultarSinKey(mensaje)
  }
}

async function consultarSinKey(mensaje: string): Promise<string> {
  // Respuestas locales para las preguntas más comunes cuando no hay conexión
  const pregunta = mensaje.toLowerCase()

  if (pregunta.includes('hta') || pregunta.includes('hipertensión') || pregunta.includes('hipertension')) {
    return `**Protocolo HTA Grado 2 en adultos (PA ≥ 160/100 mmHg):**\n\n1. **Confirmación diagnóstica:** Mínimo 2 mediciones en reposo, 2 visitas diferentes\n2. **Tratamiento farmacológico inicial:** Iniciar con 2 fármacos de primera línea\n   - IECA o ARA-II + Calcioantagonista (ej: Enalapril 10mg + Amlodipino 5mg)\n   - Alternativa: IECA + Diurético tiazídico\n3. **Metas:** PA < 140/90 mmHg (general), < 130/80 en diabéticos\n4. **Control:** Consulta en 2-4 semanas para ajuste\n5. **Modificaciones estilo de vida:** Dieta DASH, reducir sodio < 2g/día, actividad física 150 min/semana\n\n*Ref: Guía ESC/ESH 2023, MinSalud Colombia*`
  }

  if (pregunta.includes('rips') || pregunta.includes('2275')) {
    return `**RIPS según Resolución 2275/2023:**\n\n1. **Formato:** JSON estructurado (reemplazó el formato plano anterior)\n2. **Tipos de registro:**\n   - CT: Consultas\n   - AP: Procedimientos\n   - AT: Urgencias\n   - AN: Recién nacidos\n   - AC: Otros servicios\n3. **Plazo de envío:** Máximo 2 días hábiles después de la atención\n4. **Obligatorio para:** Todas las IPS habilitadas en Colombia\n5. **Validación:** Previo al envío al SISPRO/RIPS\n\n*Ref: Resolución 2275 de 2023, MinSalud*`
  }

  if (pregunta.includes('historia clínica') || pregunta.includes('3100') || pregunta.includes('hc')) {
    return `**Resolución 3100/2019 — Historia Clínica:**\n\n1. **Contenido mínimo obligatorio:**\n   - Identificación del paciente\n   - Anamnesis y motivo de consulta\n   - Examen físico\n   - Diagnóstico (CIE-10)\n   - Plan de manejo\n   - Evolución y seguimiento\n2. **Custodia:** Mínimo 20 años desde la última atención (Res. 1995/1999)\n3. **Firma:** Obligatoria del profesional tratante\n4. **Acceso:** Solo personal autorizado — Ley 1581/2012\n5. **Formato electrónico:** Válido con firma digital (Ley 527/1999)\n\n*Ref: Resolución 3100/2019, MinSalud Colombia*`
  }

  if (pregunta.includes('invima') || pregunta.includes('4725') || pregunta.includes('evento adverso') || pregunta.includes('tecnovigilancia')) {
    return `**Reporte INVIMA — Decreto 4725/2005:**\n\n**¿Cuándo reportar?**\n- Fallas o mal funcionamiento de dispositivos médicos\n- Eventos adversos serios relacionados con equipos\n- Retiros de mercado\n\n**Plazos:**\n- Eventos graves (muerte o lesión grave): 72 horas\n- Eventos no graves: 30 días\n- Retiros de mercado: Inmediato\n\n**¿Cómo reportar?**\n- Portal INVIMA: invima.gov.co\n- Programa Nacional de Tecnovigilancia\n- Formato de reporte de evento adverso\n\n*Ref: Decreto 4725/2005, Res. 4816/2008 INVIMA*`
  }

  if (pregunta.includes('sogcs') || pregunta.includes('indicadores') || pregunta.includes('calidad')) {
    return `**Indicadores SOGCS obligatorios para IPS:**\n\n1. **Oportunidad en la asignación de citas** (Res. 1552/2013)\n2. **Tasa de mortalidad intrahospitalaria**\n3. **Tasa de infecciones asociadas a la atención**\n4. **Proporción de eventos adversos**\n5. **Satisfacción del usuario**\n6. **Reingresos hospitalarios**\n7. **Cancelación de cirugías programadas**\n\n**Reporte:** Al ente territorial y al SISPRO\n**Frecuencia:** Trimestral o según resolución específica\n\n*Ref: Sistema Obligatorio de Garantía de Calidad — Decreto 1011/2006*`
  }

  if (pregunta.includes('losartán') || pregunta.includes('losartan') || pregunta.includes('amlodipino') || pregunta.includes('interacción') || pregunta.includes('interaccion')) {
    return `**Interacciones Losartán + Amlodipino:**\n\n✅ **Combinación segura y recomendada** para HTA\n\n**Sinergia terapéutica:**\n- Losartán (ARA-II): Bloquea receptor angiotensina II\n- Amlodipino (BCC): Vasodilatación periférica\n- Efecto aditivo en reducción de PA\n\n**Precauciones:**\n- Monitorear función renal e hiperpotasemia con Losartán\n- Vigilar edema periférico por Amlodipino\n- Hipotensión al inicio — iniciar dosis bajas\n\n**Contraindicaciones del Losartán:**\n- Embarazo (categoría D)\n- Estenosis bilateral de arteria renal\n\n*Ref: Vademécum Colombia, Guía ESC/ESH 2023*`
  }

  // Respuesta genérica
  return `He recibido tu consulta: **"${mensaje}"**\n\nEn este momento el servicio de IA está en modo local. Puedo responder consultas frecuentes sobre:\n\n• **HTA y protocolos clínicos**\n• **Normativa colombiana** (Res. 3100, RIPS, Habeas Data)\n• **Tecnovigilancia** (Decreto 4725, INVIMA)\n• **Indicadores SOGCS**\n• **Interacciones medicamentosas comunes**\n\nIntenta con una de las consultas rápidas del panel derecho o reformula tu pregunta con más detalle.`
}
