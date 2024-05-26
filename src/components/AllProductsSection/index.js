import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchValue: '',
    activeValue: '',
    ratingValue: '',
    onFail: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  changeOptions = updatedValue => {
    this.setState({activeValue: updatedValue}, this.getProducts)
  }

  changeRating = updatedRating => {
    this.setState({ratingValue: updatedRating}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  searchIput = value => {
    this.setState({searchValue: value}, this.getProducts)
  }

  filtersClear = () => {
    this.setState(
      {searchValue: '', activeValue: '', ratingValue: ''},
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchValue, activeValue, ratingValue} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeValue}&title_search=${searchValue}&rating=${ratingValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false, onFail: true})
    }
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length !== 0 ? (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        ) : (
          <div className="img-con">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <h1> No Products Found </h1>
            <p> We could not find any products. Try other filters. </p>
          </div>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="img-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1> Oops! Something Went Wrong </h1>
      <p> We are having some trouble processing your request. </p>
      <p> Please try again later. </p>
    </div>
  )

  onCheck = () => {
    const {onFail} = this.state
    if (onFail === true) {
      return this.renderFailure()
    }
    return this.renderProductsList()
  }

  render() {
    const {isLoading, searchValue, activeValue, ratingValue} = this.state
    console.log(ratingValue)
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          searchIput={this.searchIput}
          categoryOptions={categoryOptions}
          activeValue={activeValue}
          changeOptions={this.changeOptions}
          changeRating={this.changeRating}
          ratingsList={ratingsList}
          searchValue={searchValue}
          ratingValue={ratingValue}
          filtersClear={this.filtersClear}
        />

        {isLoading ? this.renderLoader() : this.onCheck()}
      </div>
    )
  }
}

export default AllProductsSection
