// src/comp/icons.js
function base(size) {
  return `width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
}

export function icon(name, size = 20) {
  const b = base(size);

  const icons = {
    bell: `
      <svg ${b}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    `,
    user: `
      <svg ${b}>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M20 21a8 8 0 0 0-16 0"></path>
      </svg>
    `,
    plus: `
      <svg ${b}>
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </svg>
    `,
    list: `
      <svg ${b}>
        <path d="M8 6h13"></path>
        <path d="M8 12h13"></path>
        <path d="M8 18h13"></path>
        <path d="M3 6h.01"></path>
        <path d="M3 12h.01"></path>
        <path d="M3 18h.01"></path>
      </svg>
    `,
  };

  return icons[name] || "";
}
