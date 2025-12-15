import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Reading from "./pages/Reading.jsx";
import History from "./pages/History.jsx";
import Header from "./components/Header.jsx";
import Navigation from "./components/Navigation.jsx";
import LibraryBookDetails from "./pages/LibraryBookDetails.jsx";
import AddBookLibrary from "./pages/AddBookLibrary.jsx";
import AddBookWishlist from "./pages/AddBookWishlist.jsx";
import OpenScreen from "./pages/OpenScreen.jsx";
import { useVisitorMode } from "./context/VisitorModeContext.jsx";

function App() {
  const { mode } = useVisitorMode();

  if (!mode) {
    return <OpenScreen />;
  }

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
