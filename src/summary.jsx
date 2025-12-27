import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { Link } from "react-router-dom";
import ReadingIcon from "./assets/icons/book-active.svg?react";
import FinishedIcon from "./assets/icons/history-active.svg?react";
import LibraryIcon from "./assets/icons/library-active.svg?react";
import WishlistIcon from "./assets/icons/heart-active.svg?react";
import MoreIcon from "./assets/icons/more.svg?react";
import CrowneIcon from "./assets/icons/crowne.svg?react";
import { getRandomPickCriteria } from "./utils/libraryUtils";
import RandomIcon from "./assets/icons/dice-active.svg?react";

function Summary() {
  const [latestStarted, setLatestStarted] = useState(null);
  const [latestFinished, setLatestFinished] = useState(null);
  const [latestLibrary, setLatestLibrary] = useState(null);
  const [latestWishlist, setLatestWishlist] = useState(null);
  const [randomPick, setRandomPick] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPicking, setIsPicking] = useState(false);

  const fetchRandomBook = async () => {
    setIsPicking(true);
    setRandomPick(null);

    const criteriaORString = getRandomPickCriteria();

    try {
      const { data, error } = await supabase
        .from("library")
        .select("id, title, author")
        .or(criteriaORString);

      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomBookId = data[randomIndex].id;

        const { data: bookData, error: bookError } = await supabase
          .from("library")
          .select("*")
          .eq("id", randomBookId)
          .single();

        if (bookError) throw new Error(bookError.message);
        setRandomPick(bookData);
      } else {
        setRandomPick({
          title: "No book found!",
          author: "Try again later",
        });
      }
    } catch (err) {
      setError(err.message);
      setRandomPick(null);
    } finally {
      setIsPicking(false);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [started, finished, library, wishlist] = await Promise.all([
          supabase
            .from("library")
            .select("*")
            .not("start_reading", "is", null)
            .order("start_reading", { ascending: false })
            .limit(1),

          supabase
            .from("library")
            .select("*")
            .not("end_reading", "is", null)
            .order("end_reading", { ascending: false })
            .limit(1),

          supabase
            .from("library")
            .select("*")
            .eq("in_library", true)
            .order("in_library_from", { ascending: false })
            .limit(1),

          supabase
            .from("library")
            .select("*")
            .not("on_wishlist", "is", null)
            .is("off_wishlist", null)
            .eq("in_library", false)
            .order("on_wishlist", { ascending: false })
            .limit(1),
        ]);

        if (
          started.error ||
          finished.error ||
          library.error ||
          wishlist.error
        ) {
          throw new Error(
            started.error?.message ||
              finished.error?.message ||
              library.error?.message ||
              wishlist.error?.message
          );
        }

        setLatestStarted(started.data[0]);
        setLatestFinished(finished.data[0]);
        setLatestLibrary(library.data[0]);
        setLatestWishlist(wishlist.data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const labelIcons = {
    reading: ReadingIcon,
    finished: FinishedIcon,
    library: LibraryIcon,
    wishlist: WishlistIcon,
    random: RandomIcon,
  };

  const renderBook = (book, type, labelText) => {
    if (!book) return null;

    const IconComponent = labelIcons[type] || null;

    return (
      <div className="library-book-container">
        <div className="library-book-block-label">
          {IconComponent && (
            <IconComponent
              className="library-book-block-label-icon"
              aria-label={`${type} icon`}
            />
          )}{" "}
          {labelText}
        </div>
        <div className="library-book-block">
          <div className="library-book-block-content">
            <div className="library-book-block-title">
              {book.preservation_book && (
                <CrowneIcon alt="Preservation Book" className="crowne-icon" />
              )}
              {book.title}
            </div>
            <div className="library-book-block-author">{book.author}</div>
            <div className="library-book-block-genre-more">
              <div className="library-book-block-genre">
                {book.is_fiction ? "Fictie" : "Non-fictie"}
              </div>
              <div className="library-book-container-more">
                {book.id ? (
                  <Link to={`/book-details/${book.id}`}>
                    <span>see more</span>
                    <MoreIcon
                      alt="More"
                      style={{ width: "12px", height: "12px" }}
                    />
                  </Link>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="random-pick-section">
        <button
          onClick={fetchRandomBook}
          disabled={isPicking}
          className="random-pick-button"
        >
          {isPicking ? "Picking a book..." : "Pick a random book!"}
          <RandomIcon
            className="random-icon"
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>
      {randomPick && renderBook(randomPick, "random", "Random pick for you")}

      {renderBook(latestStarted, "reading", "Currently reading")}
      {renderBook(latestFinished, "finished", "Most recently finished")}
      {renderBook(latestLibrary, "library", "Most recent addition")}
      {renderBook(
        latestWishlist,
        "wishlist",
        "Most recently added to wishlist"
      )}
    </div>
  );
}

export default Summary;
