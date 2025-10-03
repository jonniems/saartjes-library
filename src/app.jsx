import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Library from "./pages/library.jsx";
import Wishlist from "./pages/wishlist.jsx";
import Reading from "./pages/reading.jsx";
import History from "./pages/history.jsx";
import Header from "./components/header.jsx";
import Navigation from "./components/navigation.jsx";
import LibraryBookDetails from "./pages/librarybookdetails.jsx";
import AddBookLibrary from "./pages/addbooklibrary.jsx";
import AddBookWishlist from "./pages/addbookwishlist.jsx";

function App() {
  return (
    <Router basename="/">
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
