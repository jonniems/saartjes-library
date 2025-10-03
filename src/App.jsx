import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Wishlist from "./pages/Wishlist";
import Reading from "./pages/Reading";
import History from "./pages/History";
import Header from "./components/Header.jsx";
import Navigation from "./components/Navigation.jsx";
import LibraryBookDetails from "./pages/LibraryBookDetails.jsx";
import AddBookLibrary from "./pages/AddBookLibrary.jsx";
import AddBookWishlist from "./pages/AddBookWishlist.jsx";

function App() {
  return (
    <Router basename="/saartjes-library">
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
