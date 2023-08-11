import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/Layout.jsx'
import ArticleList from '../pages/Forum/ArticleList'
import NotFound from '../pages/404'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children:[
      {
        path:'/',
        element:<ArticleList/>
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
export default router
