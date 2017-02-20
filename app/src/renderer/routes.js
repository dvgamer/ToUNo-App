export default [
  {
    path: '/',
    name: 'loading',
    component: require('components/LoadingPage')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: require('components/DashboardPage')
  },
  {
    path: '*',
    redirect: '/'
  }
]
