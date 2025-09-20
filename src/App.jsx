import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Library from './Library';
import Wishlist from './Wishlist';
import Reading from './Reading';
import History from './History';
import Header from './Header.jsx';
import Navigation from './Navigation.jsx';
import LibraryBookDetails from './LibraryBookDetails.jsx';  // Importeer BookDetails
import AddBookLibrary from './AddBookLibrary.jsx';
import AddBookWishlist from './AddBookWishlist.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/history" element={<History />} />
        <Route path="/book-details/:id" element={<LibraryBookDetails />} />
        <Route path="/add-book-library" element={<AddBookLibrary />} />
        <Route path="/add-book-wishlist" element={<AddBookWishlist />} />
      </Routes>
      <Navigation />
    </Router>
  );
}

export default App;
