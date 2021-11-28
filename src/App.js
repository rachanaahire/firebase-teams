import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import PageNotFound from './components/PageNotFound';
import './App.css';
import Start from './components/Start';

function App() {
  return (
    <>
      <Start />
    </>
  );
}

export default App;
