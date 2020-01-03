import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import theme from './utils/theme';
import Home from './pages/Home';
import HeroPage from './pages/HeroPage';
import SearchPage from './pages/SearchPage';

import Header from './components/Header';

type Props = {
  globalData: Record<any, any>;
};

const App: React.FC<Props> = ({ globalData }) => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Switch>
          <Route path="/heroes/:hero" children={props => <HeroPage globalData={globalData} {...props} />} />
          <Route path="/search" children={<SearchPage />} />
          <Route path="/" exact children={<Home />} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
