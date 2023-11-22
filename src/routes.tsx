import { Routes as Router, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './frontend/pages/homePage';

const Routes = () => {
  return (
    <BrowserRouter>
      <Router>
        <Route path='/' element={<HomePage />} />
      </Router>
    </BrowserRouter>
  );
};

export default Routes;
