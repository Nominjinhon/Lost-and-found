export function createAdCard(ad, isSaved = false) {
  const dateDisplay = new Date(ad.date).toLocaleDateString("mn-MN");

  const imageSrc = ad.image
    ? ad.image.startsWith("http")
      ? ad.image
      : `http://localhost:5000/${ad.image}`
    : "images/backpack.png";

  return `<ad-card 
      id="${ad._id}" 
      title="${ad.title}" 
      image="${imageSrc}" 
      alt="${ad.title}" 
      date="${dateDisplay}" 
      location="${ad.location}" 
      status="${ad.status}"
      ${isSaved ? "is-saved" : ""}>
    </ad-card>`;
}
