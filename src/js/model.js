// MVC modules
import { API_URL, RESULT_PER_PAGE } from './config';
import { getJSON } from './helpers';
// libraries
import { async } from 'regenerator-runtime';
///////////////////////////////////////

export const state = {
  recipe: {},
  bookmarks: [],
  search: {
    query: '',
    page: 1,
    results: [],
    RESULT_PER_PAGE,
  },
};

export const loadRecipe = async function (recipeId) {
  try {
    // fatch data
    const data = await getJSON(`${API_URL}${recipeId}`);
    // destruct data
    const { recipe } = data.data;
    state.recipe = {
      cooking_time: recipe.cooking_time,
      id: recipe.id,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      source_url: recipe.source_url,
      title: recipe.title,
    };
    // handle Bookmark
    if (state.bookmarks.some(rec => rec.id === recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // alert(err);
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // fetch data
    const data = await getJSON(`${API_URL}?search=${query}`);
    // set data in glopal variable
    state.search.query = query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image_url: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const searchResultPage = function (page = state.search.page) {
  const start = (page - 1) * RESULT_PER_PAGE;
  const end = page * RESULT_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
};

export const removeBookmark = function (id) {
  if (state.bookmarks.some(rec => (rec.id = id))) {
    const index = state.bookmarks.indexOf(state.recipe);
    state.recipe.bookmarked = false;
    state.bookmarks.splice(index, 1);
  }
};

export const loadBookmarks = function () {
  const data = JSON.parse(localStorage.getItem('bookmarks'));
  if (!data) return;
  state.bookmarks = data;
};

export const storeBookmarks = function (bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};
