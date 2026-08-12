import {
  formSchema,
  formTemplateSchema,
} from "@/features/form-lab/schema";
import type { Form, FormTemplate } from "@/features/form-lab/schema";

interface CreateFormFromTemplateDependencies {
  createId: () => string;
  getCreatedAt: () => string;
}

export const formTemplates: FormTemplate[] = formTemplateSchema.array().parse([
  {
    id: "login",
    name: "Login",
    description: "Acceso para usuarios que ya tienen una cuenta.",
    category: "cuentas",
    tags: ["acceso", "email", "password", "usuarios"],
    complexity: "simple",
    fields: [
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Contraseña",
        type: "password",
        placeholder: "Ingresá tu contraseña",
        rules: [
          { type: "required", message: "La contraseña es obligatoria" },
          {
            type: "min",
            value: "6",
            message: "Debe tener al menos 6 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "signup",
    name: "Registro de usuario",
    description: "Datos esenciales para crear una cuenta nueva.",
    category: "cuentas",
    tags: ["registro", "usuarios", "email", "password"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Contraseña",
        type: "password",
        placeholder: "Creá una contraseña",
        rules: [
          { type: "required", message: "La contraseña es obligatoria" },
          {
            type: "min",
            value: "8",
            message: "Debe tener al menos 8 caracteres",
          },
        ],
      },
      {
        label: "Fecha de nacimiento",
        type: "date",
        rules: [
          { type: "required", message: "La fecha de nacimiento es obligatoria" },
        ],
      },
    ],
  },
  {
    id: "checkout",
    name: "Checkout",
    description: "Información de contacto, envío y pago para una compra.",
    category: "comercio",
    tags: ["compra", "envio", "pago", "regex"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Dirección de envío",
        type: "textarea",
        placeholder: "Calle, número, ciudad y referencias",
        rules: [{ type: "required", message: "La dirección es obligatoria" }],
      },
      {
        label: "Código postal",
        type: "text",
        placeholder: "Ej: 1000",
        rules: [
          { type: "required", message: "El código postal es obligatorio" },
          {
            type: "regex",
            value: "^\\d{4,8}$",
            message: "Ingresá un código postal válido",
          },
        ],
      },
      {
        label: "Número de tarjeta",
        type: "text",
        placeholder: "0000 0000 0000 0000",
        rules: [
          { type: "required", message: "El número de tarjeta es obligatorio" },
          {
            type: "min",
            value: "13",
            message: "Revisá el número de tarjeta",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "Formulario de contacto",
    description: "Canal breve para consultas, solicitudes o comentarios.",
    category: "servicios",
    tags: ["contacto", "consulta", "mensaje", "email"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre",
        type: "text",
        placeholder: "Tu nombre",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Asunto",
        type: "text",
        placeholder: "Motivo de la consulta",
        rules: [{ type: "required", message: "El asunto es obligatorio" }],
      },
      {
        label: "Mensaje",
        type: "textarea",
        placeholder: "Escribí tu consulta",
        rules: [
          { type: "required", message: "El mensaje es obligatorio" },
          {
            type: "min",
            value: "10",
            message: "El mensaje debe tener al menos 10 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "satisfaction",
    name: "Encuesta de satisfacción",
    description: "Opinión rápida sobre una experiencia, producto o servicio.",
    category: "feedback",
    tags: ["encuesta", "satisfaccion", "puntaje", "comentarios"],
    complexity: "simple",
    fields: [
      {
        label: "Nombre",
        type: "text",
        placeholder: "Tu nombre (opcional)",
        rules: [],
      },
      {
        label: "Puntuación",
        type: "number",
        placeholder: "Del 1 al 5",
        rules: [
          { type: "required", message: "La puntuación es obligatoria" },
          { type: "min", value: "1", message: "La puntuación mínima es 1" },
          { type: "max", value: "5", message: "La puntuación máxima es 5" },
        ],
      },
      {
        label: "Fecha de la experiencia",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Comentarios",
        type: "textarea",
        placeholder: "Contanos qué podríamos mejorar",
        rules: [],
      },
    ],
  },
  {
    id: "appointment",
    name: "Reserva de turno",
    description: "Solicitud de fecha para recibir un servicio o atención.",
    category: "reservas",
    tags: ["turno", "reserva", "servicio", "fecha"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Servicio solicitado",
        type: "text",
        placeholder: "Indicá el servicio que necesitás",
        rules: [{ type: "required", message: "El servicio es obligatorio" }],
      },
      {
        label: "Fecha del turno",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Observaciones",
        type: "textarea",
        placeholder: "Agregá información útil para el turno",
        rules: [],
      },
    ],
  },
  {
    id: "event-registration",
    name: "Inscripción a evento",
    description: "Registro de asistentes para una actividad o encuentro.",
    category: "servicios",
    tags: ["evento", "inscripcion", "asistentes", "fecha"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Nombre del evento",
        type: "text",
        placeholder: "Evento al que querés asistir",
        rules: [{ type: "required", message: "El evento es obligatorio" }],
      },
      {
        label: "Fecha del evento",
        type: "date",
        rules: [{ type: "required", message: "La fecha es obligatoria" }],
      },
      {
        label: "Cantidad de asistentes",
        type: "number",
        placeholder: "Ej: 2",
        rules: [
          { type: "required", message: "La cantidad es obligatoria" },
          {
            type: "min",
            value: "1",
            message: "Debe asistir al menos una persona",
          },
        ],
      },
      {
        label: "Comentarios",
        type: "textarea",
        placeholder: "Información adicional (opcional)",
        rules: [],
      },
    ],
  },
  {
    id: "quote-request",
    name: "Pedido de presupuesto",
    description: "Detalle inicial para cotizar un servicio o proyecto.",
    category: "servicios",
    tags: ["presupuesto", "cotizacion", "proyecto", "servicio"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre o empresa",
        type: "text",
        placeholder: "Tu nombre o razón social",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Servicio solicitado",
        type: "text",
        placeholder: "Servicio que necesitás cotizar",
        rules: [{ type: "required", message: "El servicio es obligatorio" }],
      },
      {
        label: "Presupuesto estimado",
        type: "number",
        placeholder: "Importe aproximado",
        rules: [
          {
            type: "min",
            value: "0",
            message: "El presupuesto no puede ser negativo",
          },
        ],
      },
      {
        label: "Fecha deseada",
        type: "date",
        rules: [],
      },
      {
        label: "Descripción del proyecto",
        type: "textarea",
        placeholder: "Describí el alcance y tus necesidades",
        rules: [
          { type: "required", message: "La descripción es obligatoria" },
          {
            type: "min",
            value: "20",
            message: "La descripción debe tener al menos 20 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "job-application",
    name: "Solicitud de empleo",
    description: "Presentación inicial de una candidatura laboral.",
    category: "recursos-humanos",
    tags: ["empleo", "rrhh", "candidatura", "experiencia"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Puesto solicitado",
        type: "text",
        placeholder: "Puesto al que te postulás",
        rules: [{ type: "required", message: "El puesto es obligatorio" }],
      },
      {
        label: "Años de experiencia",
        type: "number",
        placeholder: "Ej: 3",
        rules: [
          { type: "required", message: "La experiencia es obligatoria" },
          {
            type: "min",
            value: "0",
            message: "Los años no pueden ser negativos",
          },
        ],
      },
      {
        label: "Fecha de disponibilidad",
        type: "date",
        rules: [
          { type: "required", message: "La disponibilidad es obligatoria" },
        ],
      },
      {
        label: "Experiencia profesional",
        type: "textarea",
        placeholder: "Contanos sobre tu experiencia relevante",
        rules: [
          { type: "required", message: "La experiencia es obligatoria" },
          {
            type: "min",
            value: "20",
            message: "La experiencia debe tener al menos 20 caracteres",
          },
        ],
      },
      {
        label: "Presentación personal",
        type: "textarea",
        placeholder: "Agregá una breve presentación (opcional)",
        rules: [],
      },
    ],
  },
  {
    id: "newsletter-subscription",
    name: "Suscripción a newsletter",
    description: "Alta simple para recibir novedades, promociones o contenidos.",
    category: "cuentas",
    tags: ["newsletter", "suscripcion", "email", "intereses"],
    complexity: "simple",
    fields: [
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Nombre",
        type: "text",
        placeholder: "Tu nombre",
        rules: [
          {
            type: "max",
            value: "50",
            message: "El nombre no puede superar 50 caracteres",
          },
        ],
      },
      {
        label: "Intereses",
        type: "textarea",
        placeholder: "Ej: tecnología, diseño, ofertas",
        rules: [
          {
            type: "max",
            value: "140",
            message: "Los intereses no pueden superar 140 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "hotel-reservation",
    name: "Reserva de hotel",
    description: "Solicitud de alojamiento con datos de estadía y huéspedes.",
    category: "reservas",
    tags: ["hotel", "alojamiento", "huespedes", "fechas"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Fecha de ingreso",
        type: "date",
        rules: [{ type: "required", message: "La fecha de ingreso es obligatoria" }],
      },
      {
        label: "Fecha de salida",
        type: "date",
        rules: [{ type: "required", message: "La fecha de salida es obligatoria" }],
      },
      {
        label: "Cantidad de huéspedes",
        type: "number",
        placeholder: "Ej: 2",
        rules: [
          { type: "required", message: "La cantidad de huéspedes es obligatoria" },
          { type: "min", value: "1", message: "Debe haber al menos un huésped" },
          { type: "max", value: "8", message: "Para más de 8 huéspedes, consultá por grupo" },
        ],
      },
      {
        label: "Preferencias de habitación",
        type: "textarea",
        placeholder: "Cama doble, vista, accesibilidad, etc.",
        rules: [
          {
            type: "max",
            value: "220",
            message: "Las preferencias no pueden superar 220 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "course-enrollment",
    name: "Inscripción a curso",
    description: "Registro de estudiantes para una capacitación o taller.",
    category: "educacion",
    tags: ["curso", "estudiantes", "capacitacion", "edad"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Curso elegido",
        type: "text",
        placeholder: "Nombre del curso",
        rules: [{ type: "required", message: "El curso es obligatorio" }],
      },
      {
        label: "Edad",
        type: "number",
        placeholder: "Ej: 24",
        rules: [
          { type: "required", message: "La edad es obligatoria" },
          { type: "min", value: "13", message: "La edad mínima es 13 años" },
        ],
      },
      {
        label: "Experiencia previa",
        type: "textarea",
        placeholder: "Contanos si ya tenés conocimientos relacionados",
        rules: [
          {
            type: "max",
            value: "280",
            message: "La experiencia no puede superar 280 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "technical-support",
    name: "Solicitud de soporte técnico",
    description: "Reporte inicial para diagnosticar problemas técnicos.",
    category: "soporte",
    tags: ["soporte", "incidencia", "tecnico", "regex"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Producto o sistema",
        type: "text",
        placeholder: "Ej: Panel web, app móvil, impresora",
        rules: [{ type: "required", message: "Indicá el producto o sistema" }],
      },
      {
        label: "Código de incidencia",
        type: "text",
        placeholder: "Ej: INC-1234",
        rules: [
          {
            type: "regex",
            value: "^INC-\\d{4}$",
            message: "Usá el formato INC-1234",
          },
        ],
      },
      {
        label: "Descripción del problema",
        type: "textarea",
        placeholder: "Describí qué ocurre y cuándo empezó",
        rules: [
          { type: "required", message: "La descripción es obligatoria" },
          {
            type: "min",
            value: "20",
            message: "La descripción debe tener al menos 20 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "claim-warranty",
    name: "Reclamo o garantía",
    description: "Carga de reclamos por compra, falla o pedido de garantía.",
    category: "soporte",
    tags: ["reclamo", "garantia", "compra", "regex"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Número de compra",
        type: "text",
        placeholder: "Ej: ORD-2026-12345",
        rules: [
          { type: "required", message: "El número de compra es obligatorio" },
          {
            type: "regex",
            value: "^ORD-\\d{4}-\\d{5}$",
            message: "Usá el formato ORD-2026-12345",
          },
        ],
      },
      {
        label: "Producto",
        type: "text",
        placeholder: "Nombre del producto",
        rules: [{ type: "required", message: "El producto es obligatorio" }],
      },
      {
        label: "Detalle del reclamo",
        type: "textarea",
        placeholder: "Explicá la falla o el motivo del reclamo",
        rules: [
          { type: "required", message: "El detalle del reclamo es obligatorio" },
          {
            type: "min",
            value: "20",
            message: "El detalle debe tener al menos 20 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "donation",
    name: "Donación",
    description: "Formulario para registrar aportes económicos a una causa.",
    category: "servicios",
    tags: ["donacion", "aporte", "monto", "dni"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Monto a donar",
        type: "number",
        placeholder: "Ej: 5000",
        rules: [
          { type: "required", message: "El monto es obligatorio" },
          { type: "min", value: "1", message: "El monto debe ser mayor a cero" },
        ],
      },
      {
        label: "DNI o CUIT",
        type: "text",
        placeholder: "Solo números",
        rules: [
          {
            type: "regex",
            value: "^\\d{7,11}$",
            message: "Ingresá entre 7 y 11 dígitos",
          },
        ],
      },
      {
        label: "Mensaje para la organización",
        type: "textarea",
        placeholder: "Mensaje opcional",
        rules: [
          {
            type: "max",
            value: "200",
            message: "El mensaje no puede superar 200 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "patient-registration",
    name: "Registro de paciente",
    description: "Alta inicial con datos básicos para atención sanitaria.",
    category: "salud",
    tags: ["paciente", "salud", "dni", "telefono"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "DNI",
        type: "text",
        placeholder: "Ej: 12345678",
        rules: [
          { type: "required", message: "El DNI es obligatorio" },
          {
            type: "regex",
            value: "^\\d{7,8}$",
            message: "Ingresá un DNI válido de 7 u 8 dígitos",
          },
        ],
      },
      {
        label: "Fecha de nacimiento",
        type: "date",
        rules: [{ type: "required", message: "La fecha de nacimiento es obligatoria" }],
      },
      {
        label: "Teléfono",
        type: "text",
        placeholder: "Ej: 1123456789",
        rules: [
          {
            type: "regex",
            value: "^\\d{8,15}$",
            message: "Ingresá un teléfono con 8 a 15 dígitos",
          },
        ],
      },
      {
        label: "Antecedentes relevantes",
        type: "textarea",
        placeholder: "Alergias, medicación o condiciones previas",
        rules: [
          {
            type: "max",
            value: "300",
            message: "Los antecedentes no pueden superar 300 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "medical-appointment",
    name: "Pedido de turno médico",
    description: "Solicitud de consulta con especialidad, fecha y motivo.",
    category: "salud",
    tags: ["medico", "turno", "especialidad", "consulta"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Especialidad",
        type: "text",
        placeholder: "Ej: Clínica médica",
        rules: [{ type: "required", message: "La especialidad es obligatoria" }],
      },
      {
        label: "Fecha preferida",
        type: "date",
        rules: [{ type: "required", message: "La fecha preferida es obligatoria" }],
      },
      {
        label: "Motivo de consulta",
        type: "textarea",
        placeholder: "Contanos brevemente el motivo del turno",
        rules: [
          { type: "required", message: "El motivo de consulta es obligatorio" },
          {
            type: "min",
            value: "10",
            message: "El motivo debe tener al menos 10 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "product-review",
    name: "Evaluación de producto",
    description: "Opinión detallada sobre la experiencia con un producto.",
    category: "feedback",
    tags: ["producto", "evaluacion", "puntaje", "opinion"],
    complexity: "intermedia",
    fields: [
      {
        label: "Nombre del producto",
        type: "text",
        placeholder: "Producto evaluado",
        rules: [{ type: "required", message: "El producto es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [{ type: "email", message: "Ingresá un correo válido" }],
      },
      {
        label: "Puntuación",
        type: "number",
        placeholder: "Del 1 al 5",
        rules: [
          { type: "required", message: "La puntuación es obligatoria" },
          { type: "min", value: "1", message: "La puntuación mínima es 1" },
          { type: "max", value: "5", message: "La puntuación máxima es 5" },
        ],
      },
      {
        label: "Qué te gustó",
        type: "textarea",
        placeholder: "Aspectos positivos del producto",
        rules: [
          {
            type: "max",
            value: "240",
            message: "La respuesta no puede superar 240 caracteres",
          },
        ],
      },
      {
        label: "Qué mejorarías",
        type: "textarea",
        placeholder: "Sugerencias de mejora",
        rules: [
          {
            type: "max",
            value: "240",
            message: "La sugerencia no puede superar 240 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "service-review",
    name: "Evaluación de servicio",
    description: "Feedback sobre atención, tiempos y calidad de servicio.",
    category: "feedback",
    tags: ["servicio", "evaluacion", "puntaje", "comentario"],
    complexity: "intermedia",
    fields: [
      {
        label: "Servicio evaluado",
        type: "text",
        placeholder: "Nombre del servicio",
        rules: [{ type: "required", message: "El servicio es obligatorio" }],
      },
      {
        label: "Fecha de atención",
        type: "date",
        rules: [{ type: "required", message: "La fecha de atención es obligatoria" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [{ type: "email", message: "Ingresá un correo válido" }],
      },
      {
        label: "Puntuación general",
        type: "number",
        placeholder: "Del 1 al 10",
        rules: [
          { type: "required", message: "La puntuación es obligatoria" },
          { type: "min", value: "1", message: "La puntuación mínima es 1" },
          { type: "max", value: "10", message: "La puntuación máxima es 10" },
        ],
      },
      {
        label: "Comentario",
        type: "textarea",
        placeholder: "Contanos cómo fue la experiencia",
        rules: [
          {
            type: "min",
            value: "10",
            message: "El comentario debe tener al menos 10 caracteres",
          },
          {
            type: "max",
            value: "300",
            message: "El comentario no puede superar 300 caracteres",
          },
        ],
      },
    ],
  },
  {
    id: "scholarship-application",
    name: "Solicitud de beca",
    description: "Postulación con datos académicos y situación del solicitante.",
    category: "educacion",
    tags: ["beca", "educacion", "promedio", "postulacion"],
    complexity: "avanzada",
    fields: [
      {
        label: "Nombre completo",
        type: "text",
        placeholder: "Nombre y apellido",
        rules: [{ type: "required", message: "El nombre es obligatorio" }],
      },
      {
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        rules: [
          { type: "required", message: "El correo es obligatorio" },
          { type: "email", message: "Ingresá un correo válido" },
        ],
      },
      {
        label: "Institución educativa",
        type: "text",
        placeholder: "Nombre de la institución",
        rules: [{ type: "required", message: "La institución es obligatoria" }],
      },
      {
        label: "Promedio académico",
        type: "number",
        placeholder: "Ej: 8",
        rules: [
          { type: "required", message: "El promedio es obligatorio" },
          { type: "min", value: "1", message: "El promedio mínimo es 1" },
          { type: "max", value: "10", message: "El promedio máximo es 10" },
        ],
      },
      {
        label: "Motivo de la solicitud",
        type: "textarea",
        placeholder: "Explicá por qué solicitás la beca",
        rules: [
          { type: "required", message: "El motivo es obligatorio" },
          {
            type: "min",
            value: "30",
            message: "El motivo debe tener al menos 30 caracteres",
          },
        ],
      },
      {
        label: "Ingresos familiares mensuales",
        type: "number",
        placeholder: "Monto aproximado",
        rules: [
          {
            type: "min",
            value: "0",
            message: "Los ingresos no pueden ser negativos",
          },
        ],
      },
    ],
  },
]);

export function createFormFromTemplate(
  template: FormTemplate,
  dependencies: CreateFormFromTemplateDependencies
): Form {
  const form = {
    id: dependencies.createId(),
    name: template.name,
    description: template.description,
    createdAt: dependencies.getCreatedAt(),
    fields: template.fields.map((field) => ({
      ...field,
      id: dependencies.createId(),
      rules: field.rules.map((rule) => ({
        ...rule,
        id: dependencies.createId(),
      })),
    })),
  };

  return formSchema.parse(form);
}
