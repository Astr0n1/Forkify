// MVC modules
import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import searchResultView from './view/searchResultView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import getQuery from './view/searchView.js';
// librariess

module.hot?.accept();
///////////////////////////////////////
const restoreBookmarks = function () {
  model.loadBookmarks();
  bookmarksView.render(model.state.bookmarks);
};
const controlRecipe = async function () {
  try {
    // get id from hash
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;
    // update search results to mark selected recipe
    searchResultView.update(model.searchResultPage());
    // fetch data
    recipeView.renderSpinner();
    await model.loadRecipe(recipeId);

    // render recipe
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearch = async function () {
  try {
    //  get search query
    const searchQuery = getQuery();

    // get search results
    searchResultView.renderSpinner();
    await model.loadSearchResults(searchQuery);
    model.state.search.page = 1;

    // render search results
    searchResultView.render(model.searchResultPage(1));

    // render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultView.renderError();
    console.error(err);
  }
};

const controlPagination = function (targetPage) {
  model.state.search.page = targetPage;

  // render new results
  searchResultView.render(model.searchResultPage(targetPage));

  // render new  pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.render(model.state.recipe);
};

const controlBookmarks = function (recipe) {
  // ttoogle bookmark
  recipe.bookmarked
    ? model.removeBookmark(recipe.id)
    : model.addBookmark(recipe);
  // update local storage
  model.storeBookmarks(model.state.bookmarks);
  // render visual sideeffects
  recipeView.render(recipe);
  bookmarksView.render(model.state.bookmarks);
};
/////////////////////////////////////////
const init = function () {
  bookmarksView.addHandlerRender(restoreBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);
  searchResultView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
};
init();
