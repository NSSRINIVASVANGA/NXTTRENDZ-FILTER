import {IoSearch} from 'react-icons/io5'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    activeValue,
    ratingValue,
    changeOptions,
    changeRating,
    ratingsList,
    filtersClear,
  } = props

  const search = event => {
    const {searchIput} = props
    if (event.key === 'Enter') {
      searchIput(event.target.value)
    }
  }

  const optionsChange = event => {
    changeOptions(event.target.id)
  }

  const clearFilters = () => {
    filtersClear()
  }

  return (
    <div className="filters-group-container">
      <div className="input-con">
        <input
          type="search"
          placeholder="Search"
          className="input-el"
          onKeyDown={search}
        />
        <IoSearch />
      </div>
      <h1 className="category"> Category </h1>
      <div className="category-con">
        {categoryOptions.map(eachCategory => (
          <p
            className={
              activeValue === eachCategory.categoryId
                ? 'click-option'
                : 'option'
            }
            id={eachCategory.categoryId}
            onClick={optionsChange}
          >
            {eachCategory.name}
          </p>
        ))}
      </div>
      <h1 className="category"> Rating </h1>
      <ul className="ratings-con">
        {ratingsList.map(eachRating => {
          const ratingChange = () => changeRating(eachRating.ratingId)
          const classVal =
            eachRating.ratingId === ratingValue ? 'extra-click' : 'extra'
          return (
            <li
              className="list-item"
              key={eachRating.ratingId}
              onClick={ratingChange}
            >
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="stars-img"
              />
              <p className={classVal}> & up </p>
            </li>
          )
        })}
      </ul>
      <button className="clr-button" onClick={clearFilters} type="button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
