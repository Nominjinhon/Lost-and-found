export function querySelector(selector, parent = document) {
  return parent.querySelector(selector);
}

export function querySelectorAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

export function setInnerHTML(selector, html) {
  const element = querySelector(selector);
  if (element) {
    element.innerHTML = html;
  }
  return element;
}

export function toggleClass(selector, className) {
  const element = querySelector(selector);
  if (element) {
    element.classList.toggle(className);
  }
  return element;
}

export function addEventListener(selector, event, handler, parent = document) {
  const element =
    typeof selector === "string" ? querySelector(selector, parent) : selector;

  if (element) {
    element.addEventListener(event, handler);
  }
  return element;
}
