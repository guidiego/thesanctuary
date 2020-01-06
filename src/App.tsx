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
import index from './datasets/index.json';

const selectedLang = 'en';
const dataset: any = {};

index.datasets
  .filter(({ lang }) => lang === selectedLang)[0]
  .availablesDatasets
  .forEach((datasetKey) => {
    dataset[datasetKey] = require(`./datasets/${selectedLang}/${datasetKey}.json`)
  });

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Switch>
          {
            dataset.heroes.map((hero: any) => (
              <Route path={`/heroes/${hero.slug}`} children={props => <HeroPage hero={hero} {...props} />} />
            ))
          }
          <Route path="/search" children={<SearchPage />} />
          <Route path="/" exact children={<Home />} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
