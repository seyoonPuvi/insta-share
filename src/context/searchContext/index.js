import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  showSearchScreen: false,
  searchedList: [],
  activeTabName: '',
  searchedDataStatus: 'INITIAL', // Will represent loading, success, or failure
  showSearchContainer: false,
  fetchSearchedPost: () => {},
  onClickSearchPostLike: () => {},
  onChangeSearchInput: () => {},
  toggleSearchContainer: () => {},
  showSearchedContent: false,
  onClickNavItems: () => {},
})

export default SearchContext
