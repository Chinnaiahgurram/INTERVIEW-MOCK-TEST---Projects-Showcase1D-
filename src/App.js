import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Projects from './Projects'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const App = () => {
  const [category, setCategory] = useState(categoriesList[0].id)
  const [projectsList, setProjectsList] = useState([])
  const [apiResponse, setApiResponse] = useState(apiStatusConstants.initial)

  useEffect(() => {
    const getProjectsList = async () => {
      setApiResponse(apiStatusConstants.inProgress)
      const url = `https://apis.ccbp.in/ps/projects?category=${category}`
      const options = {
        method: 'GET',
      }
      const response = await fetch(url, options)
      const data = await response.json()
      console.log(data)
      if (response.ok === true) {
        const formattedData = data.projects.map(eachItem => ({
          id: eachItem.id,
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        }))
        setProjectsList(formattedData)
        setApiResponse(apiStatusConstants.success)
      } else {
        setApiResponse(apiStatusConstants.failure)
      }
    }
    getProjectsList()
  }, [category])

  const renderSuccessView = () => (
    <ul className="items-container">
      {projectsList.map(eachItem => (
        <Projects key={eachItem.id} projects={eachItem} />
      ))}
    </ul>
  )

  const onRetry = async () => {
    setApiResponse(apiStatusConstants.inProgress)
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      setProjectsList(formattedData)
      apiResponse(apiStatusConstants.success)
    } else {
      apiResponse(apiStatusConstants.failure)
    }
  }

  const renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={30} width={30} />
    </div>
  )

  const renderApiView = () => {
    switch (apiResponse) {
      case apiStatusConstants.success:
        return renderSuccessView()

      case apiStatusConstants.failure:
        return renderFailureView()

      case apiStatusConstants.inProgress:
        return renderLoadingView()

      default:
        return null
    }
  }

  const onChangeCategory = event => {
    setCategory(event.target.value)
  }

  return (
    <div className="bg-container">
      <div className="navbar">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo-image"
        />
      </div>
      <div className="app-container">
        <select className="select" value={category} onChange={onChangeCategory}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {renderApiView()}
      </div>
    </div>
  )
}

export default App
