export type Rol = 'director' | 'medico' | 'enfermero' | 'biomedico' | 'facturacion'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  activo: boolean
}

export interface Paciente {
  id: string
  nombre: string
  apellido: string
  tipoDocumento: 'CC' | 'CE' | 'TI' | 'PA'
  documento: string
  fechaNac: Date
  eps?: string
  telefono?: string
  email?: string
  grupoSanguineo?: string
}

export interface Cita {
  id: string
  pacienteId: string
  medicoId: string
  especialidad: string
  fechaHora: Date
  estado: 'pendiente' | 'confirmada' | 'atendida' | 'cancelada'
  motivo?: string
  pacienteNombre?: string
  medicoNombre?: string
}

export interface SignosVitales {
  ta: string
  fc: number
  spo2: number
  temp: number
  peso?: number
  talla?: number
}

export interface DiagnosticoCIE10 {
  codigo: string
  descripcion: string
  tipo: 'principal' | 'relacionado' | 'complicacion'
}

export interface HistoriaClinica {
  id: string
  pacienteId: string
  medicoId: string
  fecha: Date
  motivo?: string
  anamnesis?: string
  examenFisico?: string
  diagnosticos?: DiagnosticoCIE10[]
  planManejo?: string
  signosVitales?: SignosVitales
  firmada: boolean
  hashFirma?: string
  fechaFirma?: Date
  storageUrl?: string
}

export interface EquipoBiomedico {
  id: string
  nombre: string
  codigoInterno?: string
  claseRiesgo: 'I' | 'IIa' | 'IIb' | 'III'
  marca?: string
  modelo?: string
  serial?: string
  ubicacion?: string
  estado: 'operativo' | 'mantenimiento' | 'revision' | 'baja'
  vidaUtilPct?: number
  proximoMant?: Date
  proxCalibracion?: Date
}

export interface OrdenTrabajo {
  id: string
  equipoId: string
  equipoNombre?: string
  tipo: 'preventivo' | 'correctivo' | 'calibracion' | 'metrologia'
  prioridad: 'normal' | 'alta' | 'urgente'
  fechaProg?: Date
  tecnico?: string
  estado: 'abierta' | 'en_proceso' | 'completada' | 'cancelada'
  observaciones?: string
}

export interface Factura {
  id: string
  pacienteId: string
  eps?: string
  valorTotal: number
  cufe?: string
  estadoDian: 'pendiente' | 'enviada' | 'aceptada' | 'glosada' | 'rechazada'
  fecha: Date
}

export interface KpiData {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  icon: string
  color: string
  barColor: string
}

export interface ModuloConfig {
  id: string
  label: string
  icon: string
  href: string
  badge?: string | number
  badgeColor?: 'red' | 'amber' | 'green' | 'blue'
  rolesPermitidos: Rol[]
}

export interface PerfilConfig {
  id: string
  nombre: string
  rol: Rol
  cargo: string
  avatar: string
  color: string
  email: string
  password: string
}
