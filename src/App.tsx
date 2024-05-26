import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Posts from './pages/HomePage/page';
import PostDetail from './pages/PostDetail/page';
import Header from './components/header/header';
import Login from './pages/login/page';
import { Container } from '@mui/material';


function App() {
  return (
     <Router>
        <Header />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Posts />}/>
            <Route path="/post/:id" element={< PostDetail />}/>
            <Route path="/login" element={< Login />}/>
          </Routes>
        </Container>
    </Router>
  );
}

export default App;
