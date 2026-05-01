import { ModuloConfig, PerfilConfig, Rol } from '@/types'

export const MODULOS: ModuloConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', rolesPermitidos: ['director', 'medico', 'biomedico', 'facturacion'] },
  { id: 'citas', label: 'Agendamiento', icon: '📅', href: '/citas', badge: 12, badgeColor: 'red', rolesPermitidos: ['director', 'medico', 'facturacion'] },
  { id: 'historia', label: 'Historia Clínica', icon: '📋', href: '/historia', rolesPermitidos: ['director', 'medico', 'enfermero'] },
  { id: 'pacientes', label: 'Pacientes', icon: '👥', href: '/pacientes', rolesPermitidos: ['director', 'medico', 'facturacion'] },
  { id: 'biomedico', label: 'Equipos', icon: '🔬', href: '/biomedico', badge: 3, badgeColor: 'amber', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'mantenimiento', label: 'Mantenimiento', icon: '🔧', href: '/mantenimiento', badge: 5, badgeColor: 'red', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'inventario', label: 'Inventario', icon: '🏭', href: '/inventario', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'prediccion', label: 'Predicción IA', icon: '🧠', href: '/prediccion', badge: '●', badgeColor: 'green', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'disponibilidad', label: 'Disponibilidad', icon: '📡', href: '/disponibilidad', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'ordenes', label: 'Generar OT', icon: '🔩', href: '/ordenes', badge: 5, badgeColor: 'red', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'comportamiento', label: 'Comportamiento', icon: '📈', href: '/comportamiento', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'auditoria-bio', label: 'Auditoría IA', icon: '🤖', href: '/auditoria-bio', rolesPermitidos: ['director', 'biomedico'] },
  { id: 'facturacion', label: 'Facturación', icon: '💳', href: '/facturacion', rolesPermitidos: ['director', 'facturacion'] },
  { id: 'rips', label: 'RIPS / EPS', icon: '📤', href: '/rips', rolesPermitidos: ['director', 'facturacion'] },
  { id: 'auditoria', label: 'Auditoría', icon: '🛡️', href: '/auditoria', rolesPermitidos: ['director'] },
  { id: 'ia', label: 'IA Clínica', icon: '🤖', href: '/ia', badge: '●', badgeColor: 'green', rolesPermitidos: ['director', 'medico'] },
]

export const PERFILES: PerfilConfig[] = [
  { id: 'director', nombre: 'Dir. Martínez', rol: 'director', cargo: 'Director Médico', avatar: '👨‍⚕️', color: '#C74634', email: 'director@medicore.com.co', password: 'demo123' },
  { id: 'medico', nombre: 'Dra. Torres', rol: 'medico', cargo: 'Médico General', avatar: '👩‍⚕️', color: '#16A34A', email: 'torres@medicore.com.co', password: 'demo123' },
  { id: 'enfermero', nombre: 'Enf. Gómez', rol: 'enfermero', cargo: 'Enfermero Jefe', avatar: '🧑‍⚕️', color: '#7C3AED', email: 'gomez@medicore.com.co', password: 'demo123' },
  { id: 'biomedico', nombre: 'Ing. Salcedo', rol: 'biomedico', cargo: 'Ing. Biomédico', avatar: '🔬', color: '#F46800', email: 'salcedo@medicore.com.co', password: 'demo123' },
  { id: 'facturacion', nombre: 'Sra. Jiménez', rol: 'facturacion', cargo: 'Jefe de Facturación', avatar: '💼', color: '#DC2626', email: 'jimenez@medicore.com.co', password: 'demo123' },
]

export const ESPECIALIDADES = ['Medicina General', 'Cardiología', 'Pediatría', 'Ortopedia', 'Ginecología', 'Neurología', 'Dermatología', 'Psiquiatría', 'Oftalmología', 'Urología']

export const EPS_LISTA = ['Nueva EPS', 'Sura EPS', 'Sanitas', 'Compensar', 'Comfenalco', 'EPS Bolívar', 'Coomeva', 'SOS', 'Famisanar', 'Salud Total', 'Particular']

export const MODULOS_POR_ROL: Record<Rol, string[]> = {
  director: ['dashboard', 'citas', 'historia', 'pacientes', 'biomedico', 'mantenimiento', 'inventario', 'facturacion', 'rips', 'auditoria', 'ia'],
  medico: ['dashboard', 'citas', 'historia', 'ia'],
  enfermero: ['historia'],
  biomedico: ['dashboard', 'biomedico', 'mantenimiento', 'inventario', 'prediccion', 'disponibilidad', 'ordenes', 'comportamiento', 'auditoria-bio'],
  facturacion: ['dashboard', 'citas', 'facturacion', 'rips'],
}
