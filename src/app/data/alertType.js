export const alertTypes = {
  incendio: [
    "Incendio en edificio/estructura",
    "Incendio forestal o de vegetación",
    "Fuga de gas detectada"
  ],
  accidente: [
    "Accidente automovilístico con heridos",
    "Accidente automovilístico sin heridos graves",
    "Accidente de motocicleta"
  ],
  robo: [
    "Asalto a mano armada",
    "Robo en establecimiento comercial",
    "Robo de vehículo"
  ],
  emergencia: [
    "Persona herida en vía pública",
    "Persona fallecida en vía pública",
    "Disturbio o riña callejera"
  ],
  desastre: [
    "Inundación en zona urbana",
    "Deslizamiento de tierra",
    "Explosión o detonación sospechosa"
  ],
  otro: ["Otro"]
};


// Opcional: arreglo para poblar selects con label legible
export const alertTypeOptions = Object.keys(alertTypes).map((key) => ({
  value: key,
  // etiqueta con primera letra mayúscula
  label: key.charAt(0).toUpperCase() + key.slice(1)
}));

// Helper para obtener descriptions dado un type
export function getDescriptionsForType(type) {
  return alertTypes[type] || [];
}