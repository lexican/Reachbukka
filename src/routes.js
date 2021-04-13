// import React from 'react';

import Users from './admin/users/users'
import Profile from './admin/users/profile'
import Dashboard from './admin/dashboard/dashboard'

import Products from './admin/products/products';
import CreateProducts from './admin/products/CreateProduct';

import Catgories from './admin/category/categories';
import NewCategory from './admin/category/CreateCategory';
import EditCategory from './admin/category/editCategory';

import Locations from './admin/locations/locations';
import NewLocation from './admin/locations/createLocation'
import EditLocation from './admin/locations/editLocation'

import Orders from './admin/orders/orders';
import UpdateOrder from './admin/orders/update'

//import componentLoader from './admin/utils/index'

//const Users = React.lazy(() => componentLoader(() => import("./admin/users/users")));

// const Users = React.lazy(
//   () => componentLoader(UsersComponent)
// );

// const Dashboard = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./views/dashboard/Dashboard')), 100)
//     )
// );

// const Users = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./admin/users/users')), 100)
//     )
// );

// const Products = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./admin/products/products')), 100)
//     )
// );

// const Catgories = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./admin/category/categories')), 100)
//     )
// );

// const Locations = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./admin/locations/locations')), 100)
//     )
// );

// const Orders = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('./admin/orders/orders')), 100)
//     )
// );

//const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

//const Users = React.lazy(() => import('./admin/users/users'));

//const Products = React.lazy(() => import('./admin/products/products'));

//const Catgories = React.lazy(() => import('./admin/category/categories'));

//const Locations = React.lazy(() => import('./admin/locations/locations'));

//const Orders = React.lazy(() => import('./admin/orders/orders'));

// const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
// const Tables = React.lazy(() => import('./views/base/tables/Tables'));

// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/base/cards/Cards'));
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
// const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

// const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
// const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
// const Navs = React.lazy(() => import('./views/base/navs/Navs'));
// const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
// const Switches = React.lazy(() => import('./views/base/switches/Switches'));

// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/charts/Charts'));
// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
// const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
// const Users = React.lazy(() => import('./views/users/Users'));
// const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, exact: true },

  { path: '/admin/orders', name: 'Orders', component: Orders, exact: true },
  { path: '/admin/orders/:id', name: 'update', component: UpdateOrder, exact: true },

   { path: '/admin/users', name: 'Users', component: Users, exact: true },
   { path: '/admin/users/profile/:id', name: '', component: Profile, exact: true },
   

  { path: '/admin/products', name: 'Products', component: Products, exact: true },
  { path: '/admin/products/new', name: '', component: CreateProducts, exact: true },

  { path: '/admin/products/edit/:id', name: '', component: CreateProducts, exact: true },

  { path: '/admin/categories', name: 'Catgories', component: Catgories, exact: true },
  { path: '/admin/categories/new', name: '', component: NewCategory, exact: true },
  { path: '/admin/categories/edit/:id', name: '', component: EditCategory, exact: true },

  { path: '/admin/locations', name: 'Locations', component: Locations, exact: true },
  { path: '/admin/locations/new', name: '', component: NewLocation, exact: true },
  { path: '/admin/locations/edit/:id', name: '', component: EditLocation, exact: true }
];



/* const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User }
];
 */

export default routes;
