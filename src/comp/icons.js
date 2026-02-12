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
    search: `
      <svg ${b}>
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `,
    calendar: `
      <svg ${b}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    `,
    location: `
      <svg ${b}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `,
  };

  return icons[name] || "";
}
