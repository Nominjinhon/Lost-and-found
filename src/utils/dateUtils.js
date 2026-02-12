export function formatDateMN(date) {
  return new Date(date).toLocaleDateString("mn-MN");
}

export function formatDateTimeMN(date) {
  return new Date(date).toLocaleString("mn-MN");
}

export function getRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInMs = now - then;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Дөнгөж сая";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} минутын өмнө`;
  } else if (diffInHours < 24) {
    return `${diffInHours} цагийн өмнө`;
  } else if (diffInDays < 7) {
    return `${diffInDays} өдрийн өмнө`;
  } else {
    return formatDateMN(date);
  }
}
