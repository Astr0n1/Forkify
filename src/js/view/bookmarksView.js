import previewView from './previewView';
import { View } from './View';

class searchResultsView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks added yet ;)  `;

  addHandlerSearch(handler) {
    document.querySelector('.search').addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
    this._parentElement,
      addEventListener('click', e => {
        const res = e.target.closest('.preview__link');
        if (!res) return;
        const activeResults = this._parentElement.querySelectorAll(
          '.preview__link--active'
        );
        activeResults.forEach(res =>
          res.classList.remove('preview__link--active')
        );
        res.classList.add('preview__link--active');
      });
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new searchResultsView();
