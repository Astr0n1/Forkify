export default function () {
  let searchQuery = document.querySelector('.search__field').value;
  document.querySelector('.search__field').value = '';
  return searchQuery;
}
