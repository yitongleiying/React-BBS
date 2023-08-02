import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/Layout.jsx'
import NotFound from '../pages/404'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
export default router
