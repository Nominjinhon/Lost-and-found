const INITIAL_FILTER = {
  type: "lost",
  location: "Улаанбаатар",
  categories: [],
  startDate: null,
  endDate: null,
};

let currentFilter = { ...INITIAL_FILTER };
let allAds = [];
let savedAds = [];

export function getCurrentFilter() {
  return { ...currentFilter };
}

export function setCurrentFilter(filter) {
  currentFilter = { ...filter };
}

export function isDefaultFilter() {
  return JSON.stringify(currentFilter) === JSON.stringify(INITIAL_FILTER);
}

export function getAllAds() {
  return allAds;
}

export function setAllAds(ads) {
  allAds = ads;
}

export function getSavedAds() {
  return savedAds;
}

export function setSavedAds(ads) {
  savedAds = ads;
}

export const INITIAL_SHOW_COUNT = 4;
