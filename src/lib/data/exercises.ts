export interface Exercise {
  id: string;
  name: string;
  category: "Pecho" | "Espalda" | "Hombros" | "Brazos" | "Piernas" | "Core" | "Cardio" | "Movilidad" | "Mancuernas" | "CABLE MAQUINA";
  equipment: "Máquina" | "Polea" | "Mancuerna" | "Barra" | "Peso Corporal";
  musclesPrimary: string[];
  musclesSecondary: string[];
  tips: string[];
  commonMistakes: string[];
  videoUrl?: string;
  imageUrl?: string;
  searchKeywords: string[];
  iconType: "press" | "pull" | "leg" | "core" | "cardio" | "arm" | "dumbbell" | "mobility";
}

const tgSelection = "Technogym Selection";
const tgPure = "Technogym Pure";
const tgSkill = "Technogym Skill";

export const EXERCISES: Exercise[] = [
  // PIERNAS (Selection + Pure)
  { id: "leg-press-sel", name: `Leg Press (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps", "Glúteos"], musclesSecondary: ["Isquiotibiales"], tips: ["Talones apoyados", "Empuje controlado"], commonMistakes: ["Bloquear rodillas"], videoUrl: "https://www.youtube-nocookie.com/embed/I80yK2mE2mQ?rel=0", imageUrl: "/images/machines/sel-leg-press.jpg", searchKeywords: ["prensa", "pierna", "selection"], iconType: "leg" },
  { id: "leg-ext-sel", name: `Leg Extension (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps"], musclesSecondary: [], tips: ["Controla el descenso", "No balancees"], commonMistakes: ["Despegar la espalda"], videoUrl: "https://www.youtube-nocookie.com/embed/YyvSfVgiis8?rel=0", imageUrl: "/images/machines/sel-leg-ext.jpg", searchKeywords: ["extension", "selection"], iconType: "leg" },
  { id: "leg-ext-pure", name: `Leg Extension (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps"], musclesSecondary: [], tips: ["Controla el descenso", "No balancees"], commonMistakes: ["Despegar la espalda"], videoUrl: "https://www.youtube-nocookie.com/embed/YyvSfVgiis8?rel=0", imageUrl: "/images/machines/pure-leg-extension.png", searchKeywords: ["extension", "pure"], iconType: "leg" },
  { id: "leg-curl-sel", name: `Leg Curl Sentado (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Isquiotibiales"], musclesSecondary: ["Gemelos"], tips: ["Fija la rodilla", "Aprieta abajo"], commonMistakes: ["Levantar cadera"], videoUrl: "https://www.youtube-nocookie.com/embed/fK0v1R2p06M?rel=0", imageUrl: "/images/machines/sel-leg-curl.jpg", searchKeywords: ["curl", "isquio", "selection"], iconType: "leg" },
  { id: "hack-squat-pure", name: `Hack Squat (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps"], musclesSecondary: ["Glúteos"], tips: ["Bajada profunda", "Torso firme"], commonMistakes: ["Codos sueltos"], videoUrl: "https://www.youtube-nocookie.com/embed/MeIiGib86G0?rel=0", imageUrl: "/images/machines/pure-hack-squat.png", searchKeywords: ["hack", "sentadilla"], iconType: "leg" },
  { id: "leg-press-pure", name: `Leg Press 45º (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps", "Glúteo"], musclesSecondary: [], tips: ["Carga bilateral", "Rango completo"], commonMistakes: ["Poco rango"], videoUrl: "https://www.youtube-nocookie.com/embed/I80yK2mE2mQ?rel=0", imageUrl: "/images/machines/pure-leg-press.jpg", searchKeywords: ["prensa", "45"], iconType: "leg" },
  { id: "linear-leg-press-pure", name: `Linear Leg Press (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps", "Isquiotibiales"], musclesSecondary: ["Glúteo"], tips: ["Empuje fluido", "Controla la carga"], commonMistakes: ["Bloquear rodillas"], videoUrl: "https://www.youtube.com/embed/I80yK2mE2mQ", imageUrl: "/images/machines/pure-linear-leg-press.jpg", searchKeywords: ["prensa", "lineal"], iconType: "leg" },
  { id: "belt-squat-pure", name: `Belt Squat (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Cuádriceps", "Glúteo"], musclesSecondary: ["Core"], tips: ["Cinturón ajustado", "Bajada vertical"], commonMistakes: ["Inclinarse adelante"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dw505d4abf/product/MG86/pure-belt-squat-plp.jpg", searchKeywords: ["squat", "belt", "cinturon"], iconType: "leg" },
  { id: "deadlift-pure", name: `Deadlift (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Isquiotibiales", "Glúteo"], musclesSecondary: ["Lumbares"], tips: ["Espalda neutra", "Empuje de talón"], commonMistakes: ["Arquear espalda"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dwba3e4858/product/MG87/pure-deadlift-plp.jpg", searchKeywords: ["peso muerto", "pure"], iconType: "leg" },
  { id: "calf-pure", name: `Calf Raise (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Gemelos"], musclesSecondary: [], tips: ["Extensión máxima", "Controla el peso"], commonMistakes: ["Rebotar"], videoUrl: "https://www.youtube.com/embed/YyvSfVgiis8", imageUrl: "/images/machines/pure-calf.jpg", searchKeywords: ["gemelo", "pure"], iconType: "leg" },
  { id: "seated-calf-pure", name: `Seated Calf (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Sóleo"], musclesSecondary: ["Gemelos"], tips: ["Ajuste de rodilla", "Controla el descenso"], commonMistakes: ["Falta de rango"], videoUrl: "https://www.youtube.com/embed/YyvSfVgiis8", imageUrl: "/images/machines/pure-seated-calf.jpg", searchKeywords: ["gemelo", "sentado"], iconType: "leg" },
  { id: "standing-leg-curl-pure", name: `Standing Leg Curl (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Isquiotibiales"], musclesSecondary: [], tips: ["Apoyo estable", "Flexión controlada"], commonMistakes: ["Arquear espalda"], videoUrl: "https://www.youtube.com/embed/fK0v1R2p06M", imageUrl: "/images/machines/pure-standing-leg-curl.jpg", searchKeywords: ["isquio", "pie"], iconType: "leg" },
  { id: "rear-kick-pure", name: `Rear Kick (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Glúteo mayor"], musclesSecondary: ["Isquiotibiales"], tips: ["Patada explosiva", "Retorno lento"], commonMistakes: ["Giro de cadera"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "/images/machines/pure-rear-kick.jpg", searchKeywords: ["gluteo", "patada"], iconType: "leg" },
  { id: "hip-thrust-pure", name: `Hip Thrust (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Glúteo"], musclesSecondary: ["Isquiotibiales", "Core"], tips: ["Empuje de cadera", "Barbilla al pecho"], commonMistakes: ["Hiperextensión lumbar"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "/images/machines/pure-hip-thrust-generated.png", searchKeywords: ["gluteo", "empuje"], iconType: "leg" },
  { id: "standing-abductor-pure", name: `Standing Abductor (${tgPure})`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Glúteo medio"], musclesSecondary: [], tips: ["Mantén el equilibrio", "Apertura controlada"], commonMistakes: ["Inclinarse demasiado"], videoUrl: "https://www.youtube.com/embed/uK1XW1M7m4Y", imageUrl: "/images/machines/pure-standing-abductor.jpg", searchKeywords: ["abductor", "pie"], iconType: "leg" },
  { id: "calf-raise-sel", name: `Calf Raise (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Gemelos"], musclesSecondary: [], tips: ["Estiramiento completo", "Pausa arriba"], commonMistakes: ["Rebotar"], videoUrl: "https://www.youtube-nocookie.com/embed/YyvSfVgiis8?rel=0", searchKeywords: ["gemelo", "selection"], iconType: "leg" },
  { id: "adductor-sel", name: `Adductor (${tgSelection} 900)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Aductores"], musclesSecondary: [], tips: ["Espalda recta", "Cierre explosivo"], commonMistakes: ["Rango excesivo"], videoUrl: "https://www.youtube.com/embed/zJ8pCscH2_0", imageUrl: "/images/machines/sel-adductor.jpg", searchKeywords: ["aductor", "selection"], iconType: "leg" },
  { id: "abductor-sel", name: `Abductor (${tgSelection} 900)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Glúteo medio"], musclesSecondary: [], tips: ["Inclínate ligeramente", "Apertura máxima"], commonMistakes: ["Movimiento incompleto"], videoUrl: "https://www.youtube.com/embed/uK1XW1M7m4Y", imageUrl: "/images/machines/sel-abductor.jpg", searchKeywords: ["abductor", "selection"], iconType: "leg" },
  { id: "ad-ab-dual-sel", name: `Dual Adductor/Abductor (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Aductores", "Glúteo medio"], musclesSecondary: [], tips: ["Ajuste de la palanca", "Rango completo"], commonMistakes: ["Movimiento brusco"], videoUrl: "https://www.youtube.com/embed/uK1XW1M7m4Y", imageUrl: "/images/machines/sel-dual-ab-ad.jpg", searchKeywords: ["adductor", "abductor", "selection"], iconType: "leg" },
  { id: "multi-hip-sel", name: `Multi Hip (${tgSelection} 700)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Glúteo", "Psoas"], musclesSecondary: ["Aductores"], tips: ["Ajuste de rodillo", "Estabilidad central"], commonMistakes: ["Balancear cuerpo"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "/images/machines/sel-multi-hip.jpg", searchKeywords: ["cadera", "multi", "selection"], iconType: "leg" },
  { id: "prone-curl-sel", name: `Prone Leg Curl (${tgSelection} 900)`, category: "Piernas", equipment: "Máquina", musclesPrimary: ["Isquiotibiales"], musclesSecondary: ["Gemelos"], tips: ["Caderas pegadas", "Flexión total"], commonMistakes: ["Levantar glúteo"], videoUrl: "https://www.youtube.com/embed/fK0v1R2p06M", imageUrl: "/images/machines/sel-prone-curl.jpg", searchKeywords: ["curl", "isquio", "tumbado"], iconType: "leg" },

  // PECHO (Selection + Pure)
  { id: "chest-press-pure", name: `Chest Press (${tgPure})`, category: "Pecho", equipment: "Máquina", musclesPrimary: ["Pectoral mayor"], musclesSecondary: ["Tríceps"], tips: ["Carga placas", "Empuje potente"], commonMistakes: ["Hombros arriba"], videoUrl: "https://www.youtube.com/embed/YvQk1k62D0I", imageUrl: "/images/machines/pure-chest-press-official.jpg", searchKeywords: ["pecho", "press", "pure"], iconType: "press" },
  { id: "chest-press-sel", name: `Chest Press (${tgSelection} 700)`, category: "Pecho", equipment: "Máquina", musclesPrimary: ["Pectoral mayor"], musclesSecondary: ["Tríceps"], tips: ["Ajuste de asiento", "Empuje firme"], commonMistakes: ["Codos muy altos"], videoUrl: "https://www.youtube.com/embed/YvQk1k62D0I", imageUrl: "/images/machines/sel-chest-press.jpg", searchKeywords: ["pecho", "press", "selection"], iconType: "press" },
  { id: "inc-chest-pure", name: `Incline Chest Press (${tgPure})`, category: "Pecho", equipment: "Máquina", musclesPrimary: ["Pectoral superior"], musclesSecondary: ["Deltoides ant."], tips: ["Empuje diagonal", "Asiento bajo"], commonMistakes: ["Arqueo lumbar"], videoUrl: "https://www.youtube.com/embed/8iPvtMvX8_E", imageUrl: "/images/machines/pure-incline-chest-press.png", searchKeywords: ["inclinado", "pure"], iconType: "press" },
  { id: "wide-chest-pure", name: `Wide Chest Press (${tgPure})`, category: "Pecho", equipment: "Máquina", musclesPrimary: ["Pectoral inferior"], musclesSecondary: ["Tríceps"], tips: ["Agarre ancho", "Baja lento"], commonMistakes: ["Codos fijos"], videoUrl: "https://www.youtube-nocookie.com/embed/Xh0s_26b27E?rel=0", imageUrl: "/images/machines/pure-chest-press.png", searchKeywords: ["ancho", "press"], iconType: "press" },
  { id: "db-chest-press", name: "Press Banca con Mancuernas", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Pectoral mayor"], musclesSecondary: ["Tríceps", "Deltoides ant."], tips: ["Rango profundo", "Junta al subir"], commonMistakes: ["Chocar mancuernas"], videoUrl: "https://www.youtube.com/embed/YvQk1k62D0I", imageUrl: "/images/exercises/db-chest-press.png", searchKeywords: ["mancuerna", "pecho", "press"], iconType: "dumbbell" },

  // ESPALDA (Selection + Pure)
  { id: "lat-machine-sel", name: `Lat Machine (${tgSelection} 700)`, category: "Espalda", equipment: "Polea", musclesPrimary: ["Dorsal ancho"], musclesSecondary: ["Bíceps"], tips: ["Pecho al cielo", "Tira con codos"], commonMistakes: ["Balancear"], videoUrl: "https://www.youtube-nocookie.com/embed/CAwf7n6Luuc?rel=0", imageUrl: "/images/machines/sel-lat-machine.jpg", searchKeywords: ["jalon", "espalda", "selection"], iconType: "pull" },
  { id: "low-row-sel", name: `Low Row (${tgSelection} 700)`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal", "Romboides"], musclesSecondary: ["Bíceps"], tips: ["Pecho contra apoyo", "Estira dorsales"], commonMistakes: ["Encoger hombros"], videoUrl: "https://www.youtube-nocookie.com/embed/GZbfZ033f74?rel=0", imageUrl: "/images/machines/sel-low-row.jpg", searchKeywords: ["remo", "bajo", "selection"], iconType: "pull" },
  { id: "vert-traction-sel", name: `Vertical Traction (${tgSelection} 700)`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal"], musclesSecondary: ["Bíceps"], tips: ["Agarre neutro", "Tira vertical"], commonMistakes: ["Poca extension"], videoUrl: "https://www.youtube.com/embed/e_wK7G474Y0", imageUrl: "/images/machines/sel-lat-machine.jpg", searchKeywords: ["traccion", "espalda", "selection"], iconType: "pull" },
  { id: "upper-back-sel", name: `Upper Back (${tgSelection} 900)`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Trapecio", "Romboides"], musclesSecondary: ["Deltoides post."], tips: ["Codos altos", "Junta escápulas"], commonMistakes: ["Encoger cuello"], videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", imageUrl: "/images/machines/sel-upper-back.jpg", searchKeywords: ["espalda", "alta", "selection"], iconType: "pull" },
  { id: "pulldown-pure", name: `Pull Down (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal lateral"], musclesSecondary: ["Bíceps"], tips: ["Agarre abierto", "Controla carga"], commonMistakes: ["Uso excesivo de brazos"], videoUrl: "https://www.youtube-nocookie.com/embed/CAwf7n6Luuc?rel=0", imageUrl: "/images/machines/pure-pulldown.png", searchKeywords: ["pure", "jalon"], iconType: "pull" },
  { id: "pullover-pure", name: `Pullover (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal ancho", "Serrato"], musclesSecondary: ["Tríceps"], tips: ["Rango amplio", "Controla el retorno"], commonMistakes: ["Despegar la espalda"], videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc", imageUrl: "/images/machines/pure-pullover.jpg", searchKeywords: ["pullover", "serrato"], iconType: "pull" },
  { id: "row-pure", name: `Row (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal", "Romboides"], musclesSecondary: ["Bíceps"], tips: ["Codos atrás", "Pecho pegado"], commonMistakes: ["Encoger hombros"], videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", imageUrl: "/images/machines/pure-row.jpg", searchKeywords: ["remo", "pure"], iconType: "pull" },
  { id: "seated-row-pure", name: `Seated Row (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Espalda media"], musclesSecondary: ["Bíceps"], tips: ["Tracción potente", "Pecho estable"], commonMistakes: ["Inclinarse atrás"], videoUrl: "https://www.youtube-nocookie.com/embed/GZbfZ033f74?rel=0", imageUrl: "/images/machines/pure-seated-row.png", searchKeywords: ["remo", "pure"], iconType: "pull" },
  { id: "low-row-pure", name: `Low Row (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal inferior", "Trapecio"], musclesSecondary: [], tips: ["Tracción baja", "Escápulas"], commonMistakes: ["Girar torso"], videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", imageUrl: "/images/machines/pure-low-row.jpg", searchKeywords: ["remo", "bajo", "pure"], iconType: "pull" },
  { id: "t-bar-row-pure", name: `T-Bar Row (${tgPure})`, category: "Espalda", equipment: "Máquina", musclesPrimary: ["Dorsal ancho", "Romboides"], musclesSecondary: ["Bíceps"], tips: ["Pecho al apoyo", "Tracción potente"], commonMistakes: ["Balancear"], videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dwe24a5f03/product/PG12/t-bar-row-pure-plp.jpg", searchKeywords: ["t-bar", "remo", "pure"], iconType: "pull" },

  // HOMBROS
  { id: "shoulder-press-pure", name: `Shoulder Press (${tgPure})`, category: "Hombros", equipment: "Máquina", musclesPrimary: ["Deltoides"], musclesSecondary: ["Tríceps"], tips: ["Carga bilateral", "Empuje vertical"], commonMistakes: ["Arquear espalda"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "/images/machines/pure-shoulder-press.png", searchKeywords: ["hombro", "press", "pure"], iconType: "press" },
  { id: "shoulder-press-sel", name: `Shoulder Press (${tgSelection} 700)`, category: "Hombros", equipment: "Máquina", musclesPrimary: ["Deltoides"], musclesSecondary: ["Tríceps"], tips: ["Mirada al frente", "No bloquees"], commonMistakes: ["Empuje con lumbar"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "/images/machines/sel-shoulder-press.jpg", searchKeywords: ["hombro", "press", "selection"], iconType: "press" },
  { id: "back-delt-sel", name: `Reverse Fly (${tgSelection} 900)`, category: "Hombros", equipment: "Máquina", musclesPrimary: ["Deltoides posterior"], musclesSecondary: ["Romboides"], tips: ["Codos fijos", "Vuela hacia atrás"], commonMistakes: ["Cerrar manos"], videoUrl: "https://www.youtube.com/embed/eGjt4lk6gjw", imageUrl: "/images/machines/sel-pectoral.jpg", searchKeywords: ["pajaro", "hombro post", "selection"], iconType: "pull" },

  // BRAZOS
  { id: "arm-curl-sel", name: `Arm Curl (${tgSelection} 900)`, category: "Brazos", equipment: "Máquina", musclesPrimary: ["Bíceps"], musclesSecondary: ["Braquial"], tips: ["Tríceps bien apoyados", "Flexión total"], commonMistakes: ["Balancear hombros"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/machines/sel-pectoral.jpg", searchKeywords: ["biceps", "curl", "selection"], iconType: "arm" },
  { id: "arm-ext-sel", name: `Arm Extension (${tgSelection} 900)`, category: "Brazos", equipment: "Máquina", musclesPrimary: ["Tríceps"], musclesSecondary: [], tips: ["Extensión completa", "Controla peso"], commonMistakes: ["Hombros arriba"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/machines/pure-seated-dip.jpg", searchKeywords: ["triceps", "extensores", "selection"], iconType: "arm" },
  { id: "biceps-pure", name: `Biceps Curl (${tgPure})`, category: "Brazos", equipment: "Máquina", musclesPrimary: ["Bíceps"], musclesSecondary: [], tips: ["Carga de discos", "Agarre supino"], commonMistakes: ["Movimiento brusco"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/machines/pure-biceps-curl.png", searchKeywords: ["biceps", "pure"], iconType: "arm" },
  { id: "seated-dip-pure", name: `Seated Dip (${tgPure})`, category: "Brazos", equipment: "Máquina", musclesPrimary: ["Tríceps", "Pectoral inferior"], musclesSecondary: ["Deltoides ant."], tips: ["Empuje hacia abajo", "Controla el ascenso"], commonMistakes: ["Hombros arriba"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/machines/pure-seated-dip.jpg", searchKeywords: ["triceps", "fondos"], iconType: "arm" },
  { id: "db-biceps-curl", name: "Curl de Bíceps con Mancuernas", category: "Brazos", equipment: "Mancuerna", musclesPrimary: ["Bíceps"], musclesSecondary: ["Braquial"], tips: ["Giro de muñeca", "Codos pegados"], commonMistakes: ["Balancear torso"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", searchKeywords: ["biceps", "mancuerna"], iconType: "dumbbell" },

  // CORE
  { id: "crunch-sel", name: `Abdominal Crunch (${tgSelection} 700)`, category: "Core", equipment: "Máquina", musclesPrimary: ["Abdominales"], musclesSecondary: [], tips: ["Enrosca la columna", "Exhala al bajar"], commonMistakes: ["Tirar de cuello"], videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c", imageUrl: "/images/machines/sel-abs-crunch.jpg", searchKeywords: ["crunch", "abs", "selection"], iconType: "core" },
  { id: "rotary-torso-sel", name: `Rotary Torso (${tgSelection} 900)`, category: "Core", equipment: "Máquina", musclesPrimary: ["Oblicuos"], musclesSecondary: [], tips: ["Giro controlado", "Base fija"], commonMistakes: ["Girar caderas"], videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c", searchKeywords: ["giro", "oblicuos", "selection"], iconType: "core" },
  { id: "lower-back-sel", name: `Lower Back (${tgSelection} 700)`, category: "Core", equipment: "Máquina", musclesPrimary: ["Lumbares"], musclesSecondary: ["Glúteos"], tips: ["Sube lento", "No hiper-extiendas"], commonMistakes: ["Velocidad"], videoUrl: "https://www.youtube.com/embed/7uKzXfE9Y1U", imageUrl: "/images/machines/sel-lower-back.jpg", searchKeywords: ["lumbares", "pajaros", "selection"], iconType: "core" },
  { id: "lower-back-pure", name: `Lower Back Bench (${tgPure})`, category: "Core", equipment: "Máquina", musclesPrimary: ["Lumbares", "Isquios"], musclesSecondary: ["Glúteo"], tips: ["Ajuste de cadera", "Mantén cuello neutro"], commonMistakes: ["Rebotar"], videoUrl: "https://www.youtube.com/embed/7uKzXfE9Y1U", imageUrl: "/images/machines/tg-back-extension-bench.png", searchKeywords: ["lumbar", "extension", "pure"], iconType: "core" },
  { id: "military-bench-pure", name: `Olympic Military Bench (${tgPure})`, category: "Hombros", equipment: "Barra", musclesPrimary: ["Deltoides"], musclesSecondary: ["Tríceps"], tips: ["Espalda apoyada", "Empuje vertical"], commonMistakes: ["Arquear lumbar"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dw765a4210/product/PG08-NBV000/olympic-military-bench-pure-plp.jpg", searchKeywords: ["press", "militar", "olimpico"], iconType: "press" },
  { id: "ab-crunch-pure", name: "Banco de Abdominales", category: "Core", equipment: "Peso Corporal", musclesPrimary: ["Abdominales"], musclesSecondary: [], tips: ["Movimiento controlado", "Tensión constante"], commonMistakes: ["Tirar de cuello"], videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c", imageUrl: "/images/machines/pure-ab-bench.png", searchKeywords: ["crunch", "abs", "banco"], iconType: "core" },
  { id: "flat-bench-pure", name: `Olympic Flat Bench (${tgPure})`, category: "Pecho", equipment: "Barra", musclesPrimary: ["Pectoral mayor"], musclesSecondary: ["Tríceps"], tips: ["Retrae escápulas", "Apóyate bien"], commonMistakes: ["Despegar glúteos"], videoUrl: "https://www.youtube.com/embed/YvQk1k62D0I", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dw61d27bf0/product/PG07-NBV000/olympic-flat-bench-plp.jpg", searchKeywords: ["press", "banca", "olimpico"], iconType: "press" },
  { id: "incline-bench-pure", name: `Olympic Incline Bench (${tgPure})`, category: "Pecho", equipment: "Barra", musclesPrimary: ["Pectoral superior"], musclesSecondary: ["Deltoides ant."], tips: ["Empuje controlado", "Mirada arriba"], commonMistakes: ["Arquear espalda"], videoUrl: "https://www.youtube.com/embed/8iPvtMvX8_E", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dwcf294daa/product/PG01-NBV000/olympic-incline-bench-plp.jpg", searchKeywords: ["inclinado", "olimpico"], iconType: "press" },
  { id: "decline-bench-pure", name: `Olympic Decline Bench (${tgPure})`, category: "Pecho", equipment: "Barra", musclesPrimary: ["Pectoral inferior"], musclesSecondary: ["Tríceps"], tips: ["Fija los pies", "Controla la barra"], commonMistakes: ["Inestabilidad"], videoUrl: "https://www.youtube.com/embed/Xh0s_26b27E", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dw06ad277b/product/PG23-NBV000/olympic-decline-bench-pure-plp.jpg", searchKeywords: ["declinado", "olimpico"], iconType: "press" },
  { id: "scott-bench-pure", name: `Scott Bench (${tgPure})`, category: "Brazos", equipment: "Barra", musclesPrimary: ["Bíceps"], musclesSecondary: [], tips: ["Axilas pegadas", "Extensión total"], commonMistakes: ["Balancear torso"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "https://webapi-prod.technogym.com/dw/image/v2/BFLQ_PRD/on/demandware.static/-/Sites-tg-catalog-master/default/dwb9064715/product/PG06-NBV000/scott-bench-pure-plp.jpg", searchKeywords: ["biceps", "scott"], iconType: "arm" },

  // CARDIO / FUNCIONAL
  { id: "skillmill-run", name: "Cinta Andar/Correr", category: "Cardio", equipment: "Máquina", musclesPrimary: ["Completo"], musclesSecondary: [], tips: ["Carrera natural", "Resistencia ajustable"], commonMistakes: ["Postura encorvada"], videoUrl: "https://www.youtube.com/embed/IZxyjW7nr7M", searchKeywords: ["correr", "skillmill", "cinta"], iconType: "cardio" },
  { id: "skillrow-row", name: "Remo", category: "Cardio", equipment: "Máquina", musclesPrimary: ["Espalda", "Piernas"], musclesSecondary: ["Core"], tips: ["Tracción fluida", "Empuje pierna"], commonMistakes: ["Tirar de brazos"], videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", searchKeywords: ["remo", "cardio", "skillrow"], iconType: "cardio" },
  { id: "skillbike-ride", name: "Bici", category: "Cardio", equipment: "Máquina", musclesPrimary: ["Piernas"], musclesSecondary: ["Cardio"], tips: ["Ajuste de sillín", "Cadencia constante"], commonMistakes: ["Rodillas afuera"], videoUrl: "https://www.youtube.com/embed/IZxyjW7nr7M", searchKeywords: ["bici", "skillbike"], iconType: "cardio" },

  // MOVILIDAD
  { id: "stretching-gen", name: "Estiramiento General", category: "Movilidad", equipment: "Peso Corporal", musclesPrimary: ["Completo"], musclesSecondary: [], tips: ["Respira profundo", "No rebotes"], commonMistakes: ["Forzar el rango"], searchKeywords: ["estirar", "flexibilidad"], iconType: "mobility" },
  { id: "foam-roller", name: "Foam Roller", category: "Movilidad", equipment: "Peso Corporal", musclesPrimary: ["Liberación Miofascial"], musclesSecondary: [], tips: ["Pasa lento sobre zonas tensas", "Evita articulaciones"], commonMistakes: ["Rodar muy rápido"], searchKeywords: ["rodillo", "masaje"], iconType: "mobility" },
  { id: "cat-cow", name: "Cat-Cow (Movilidad Espalda)", category: "Movilidad", equipment: "Peso Corporal", musclesPrimary: ["Espalda"], musclesSecondary: ["Core"], tips: ["Sincroniza con respiración", "Articula vértebra a vértebra"], commonMistakes: ["Movimiento brusco"], searchKeywords: ["yoga", "espalda"], iconType: "mobility" },

  // MANCUERNAS (Dumbbells)
  { id: "db-bicep-curl", name: "Curl de Bíceps", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Bíceps"], musclesSecondary: ["Braquial"], tips: ["Espalda recta", "No balancear el cuerpo"], commonMistakes: ["Uso de inercia"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/exercises/db-bicep-curl.png", searchKeywords: ["biceps", "mancuerna", "curl"], iconType: "dumbbell" },
  { id: "db-arnold-press", name: "Press Arnold", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Deltoides"], musclesSecondary: ["Tríceps"], tips: ["Rotación fluida", "Controla el descenso"], commonMistakes: ["Girar muy rápido"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "/images/exercises/db-arnold-press.png", searchKeywords: ["hombro", "press", "arnold"], iconType: "dumbbell" },
  { id: "db-farmers-walk", name: "El Granjero", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Core", "Grip"], musclesSecondary: ["Trapecio", "Piernas"], tips: ["Pasos cortos", "Pecho arriba"], commonMistakes: ["Mirar al suelo"], videoUrl: "https://www.youtube.com/embed/IZxyjW7nr7M", imageUrl: "/images/exercises/db-farmers-walk.png", searchKeywords: ["granjero", "farmers", "core"], iconType: "dumbbell" },
  { id: "db-shoulder-press", name: "Press de Hombros con Mancuernas", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Deltoides"], musclesSecondary: ["Tríceps"], tips: ["No choques las pesas", "Rango de 90 grados"], commonMistakes: ["Arquear espalda"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "/images/exercises/db-shoulder-press.png", searchKeywords: ["hombro", "press", "pesas"], iconType: "dumbbell" },
  { id: "db-cross-hammer", name: "Cross Body Hammer Curl", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Bíceps", "Braquiorradial"], musclesSecondary: [], tips: ["Cruza hacia el hombro opuesto", "Aprieta arriba"], commonMistakes: ["Balanceo"], videoUrl: "https://www.youtube.com/embed/AsdvN_XEl_c", imageUrl: "/images/exercises/db-cross-hammer.png", searchKeywords: ["biceps", "hammer", "martillo"], iconType: "dumbbell" },
  { id: "db-step-ups", name: "Step-ups", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Cuádriceps", "Glúteos"], musclesSecondary: ["Core"], tips: ["Sube con potencia", "Baja lento"], commonMistakes: ["Rebotar el pie de abajo"], videoUrl: "https://www.youtube.com/embed/MeIiGib86G0", imageUrl: "/images/exercises/db-step-ups.png", searchKeywords: ["piernas", "step", "subida"], iconType: "dumbbell" },
  { id: "db-push-ups", name: "Flexión de brazos con mancuernas", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Pectoral", "Tríceps"], musclesSecondary: ["Core"], tips: ["Agarre neutro", "Baja profundo"], commonMistakes: ["Codos abiertos"], videoUrl: "https://www.youtube.com/embed/YvQk1k62D0I", imageUrl: "/images/exercises/db-push-ups.png", searchKeywords: ["pecho", "flexion", "mancuerna"], iconType: "dumbbell" },
  { id: "db-chest-fly", name: "Vuelo plano con mancuernas", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Pectoral"], musclesSecondary: ["Deltoide ant."], tips: ["Codos ligeramente flexionados", "Siente el estiramiento"], commonMistakes: ["Juntar pesas"], videoUrl: "https://www.youtube.com/embed/Xh0s_26b27E", imageUrl: "/images/exercises/db-chest-fly.png", searchKeywords: ["pecho", "apertura", "mancuerna"], iconType: "dumbbell" },
  { id: "db-lateral-raise", name: "Hombros con mancuernas", category: "Mancuernas", equipment: "Mancuerna", musclesPrimary: ["Deltoides lateral"], musclesSecondary: ["Trapecio"], tips: ["Sube hasta paralelo", "Meñique ligeramente arriba"], commonMistakes: ["Subir demasiado"], videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", imageUrl: "/images/exercises/db-lateral-raise.png", searchKeywords: ["hombro", "vuelos", "lat"], iconType: "dumbbell" },
  {
    id: "cable-bicep-curl",
    name: "Bíceps en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Bíceps"],
    musclesSecondary: ["Antebrazos"],
    tips: ["Mantener codos pegados al cuerpo", "Extensión completa"],
    commonMistakes: ["Balancear el cuerpo", "No completar el rango"],
    imageUrl: "/images/exercises/cable-bicep-curl.png",
    searchKeywords: ["biceps", "polea", "curl", "brazos"],
    iconType: "arm"
  },
  {
    id: "cable-tricep-pushdown",
    name: "Tríceps en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Tríceps"],
    musclesSecondary: ["Hombros"],
    tips: ["Codos bloqueados a los lados", "Presionar hasta abajo"],
    commonMistakes: ["Separar codos", "Usar demasiado peso"],
    imageUrl: "/images/exercises/cable-tricep-pushdown.png",
    searchKeywords: ["triceps", "polea", "pushdown", "brazos"],
    iconType: "arm"
  },
  {
    id: "cable-woodchopper",
    name: "Torsiones Laterales en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Core", "Oblicuos"],
    musclesSecondary: ["Hombros"],
    tips: ["Rotar desde el torso", "Mantener brazos extendidos"],
    commonMistakes: ["Mover solo los brazos", "Pies inestables"],
    imageUrl: "/images/exercises/cable-woodchopper.png",
    searchKeywords: ["core", "oblicuos", "torsion", "woodchopper"],
    iconType: "core"
  },
  {
    id: "cable-chest-fly",
    name: "Pecho en Poleas (Cruces)",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Pecho"],
    musclesSecondary: ["Hombros"],
    tips: ["Ligera flexión de codos", "Sentir el estiramiento"],
    commonMistakes: ["Chocar las manos", "Encoger hombros"],
    imageUrl: "/images/exercises/cable-chest-fly.png",
    searchKeywords: ["pecho", "polea", "cruces", "fly"],
    iconType: "press"
  },
  {
    id: "cable-lateral-raise",
    name: "Elevaciones Laterales en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Hombros"],
    musclesSecondary: ["Trapecio"],
    tips: ["Subir hasta la altura del hombro", "Controlar la bajada"],
    commonMistakes: ["Subir por encima del hombro", "Tirar con el cuerpo"],
    imageUrl: "/images/exercises/cable-lateral-raise.png",
    searchKeywords: ["hombros", "polea", "lateral", "vuelos"],
    iconType: "pull"
  },
  {
    id: "cable-chest-press",
    name: "Press de Pecho en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Pecho"],
    musclesSecondary: ["Tríceps", "Hombros"],
    tips: ["Mantener estabilidad del core", "Empuje explosivo"],
    commonMistakes: ["Perder el equilibrio", "Rango incompleto"],
    imageUrl: "/images/exercises/cable-chest-press.png",
    searchKeywords: ["pecho", "polea", "press", "empuje"],
    iconType: "press"
  },
  {
    id: "cable-low-row",
    name: "Low Row en Polea",
    category: "CABLE MAQUINA",
    equipment: "Polea",
    musclesPrimary: ["Espalda"],
    musclesSecondary: ["Bíceps", "Hombros"],
    tips: ["Espalda recta", "Llevar la polea al abdomen"],
    commonMistakes: ["Arquear la espalda", "Usar el impulso"],
    imageUrl: "/images/exercises/cable-low-row.png",
    searchKeywords: ["espalda", "polea", "row", "remo"],
    iconType: "pull"
  },
];

export const CATEGORIES = ["Pecho", "Espalda", "Hombros", "Brazos", "Piernas", "Core", "Cardio", "Movilidad", "Mancuernas", "CABLE MAQUINA"];
