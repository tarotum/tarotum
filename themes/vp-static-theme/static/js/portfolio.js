'use strict';

import Grid from "./shared/grid.js";

const urlKeys = {
    category: "category",
    service: "service",
}

/**
 * @param {NodeListOf<HTMLElement>} works 
 * @param {string} category 
 * @param {string} service
 * @returns {NodeListOf<HTMLElement>}
 */
function filterWorks(works = [], category, service) {
    return Array.from(works).reduce((acc, workEl) => {
        const workCategories = workEl.dataset.categories || "";
        const workServices = workEl.dataset.services || "";
        const isSelected = workCategories.includes(category || "") && workServices.includes(service || "");

        if (isSelected) {
            workEl.classList.remove("grid-item-hidden");
        } else {
            workEl.classList.add("grid-item-hidden");
        }

        if (isSelected) {
            return acc.concat(workEl);
        }

        return acc;
    }, []);
}

// Intial Page Data
const gridEl = document.querySelector('.grid');
const gridItemsEl = document.querySelectorAll('.grid-item');
const initialSearchParams = new URLSearchParams(window.location.search);
const initialCategory = initialSearchParams.get(urlKeys.category) || "";
const initialService = initialSearchParams.get(urlKeys.service) || "";

const filteredIWorks = filterWorks(
    gridItemsEl,
    initialSearchParams.get(urlKeys.category),
    initialSearchParams.get(urlKeys.service)
);

const grid = new Grid(gridEl, filteredIWorks, 2).init({
    '(max-width: 42em)': 2,
    '(min-width: 42em)': 3,
    '(min-width: 60em)': 4,
    '(min-width: 81em)': 5,
});

/**
 * @param {Record<string, string>} params 
 */
function updateSelectedWorks(params = {}) {
    const searchParams = new URLSearchParams(window.location.search);
    let url = window.location.pathname;

    Object.keys(params).forEach(key => {
        const isEmptyValue = !params[key];

        if (isEmptyValue) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, params[key]);
        }
    });

    if (searchParams.size > 0) {
        url = "?" + searchParams.toString();
    }

    history.pushState(null, "", url); // changing url 

    const updatedWorks = filterWorks(
        gridItemsEl,
        searchParams.get(urlKeys.category),
        searchParams.get(urlKeys.service)
    );

    // re-generating grid of works
    grid.updateGrid(updatedWorks);
}

const worksCategorySelectEl = document.querySelector("#works-category-select");
const worksCategoryResetEl = document.querySelector("#works-category-reset");
const worksServiceSelectEl = document.querySelector("#works-service-select");
const worksServiceRestEl = document.querySelector("#works-service-reset");
const worksRestEl = document.querySelector("#works-reset");

if (worksCategorySelectEl && worksServiceSelectEl) {
    worksCategorySelectEl.value = initialCategory;
    worksCategorySelectEl.addEventListener('change', (event) => {
        const category = event.target.value;
        updateSelectedWorks({ category });
    });

    worksCategoryResetEl.addEventListener('click', () => {
        worksCategorySelectEl.value = "";
        updateSelectedWorks({ category: "" });
    });

    worksServiceSelectEl.value = initialService;
    worksServiceSelectEl.addEventListener('change', (event) => {
        const service = event.target.value;
        updateSelectedWorks({ service });
    });

    worksServiceRestEl.addEventListener('click', () => {
        worksServiceSelectEl.value = "";
        updateSelectedWorks({ service: "" });
    });

    worksRestEl.addEventListener('click', () => {
        worksCategorySelectEl.value = "";
        worksServiceSelectEl.value = "";
        updateSelectedWorks({ service: "", category: "" });
    });
}