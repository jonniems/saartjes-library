import { useEffect, useState } from "react";
import { supabase } from './utils/supabase';
import { Link } from "react-router-dom";

import readingIcon from './assets/icons/book-active.svg';
import finishedIcon from './assets/icons/history-active.svg';
import libraryIcon from './assets/icons/library-active.svg';
import wishlistIcon from './assets/icons/heart-active.svg';
import moreIcon from './assets/icons/more.svg';

function Library() {
  const [latestStarted, setLatestStarted] = useState(null);
  const [latestFinished, setLatestFinished] = useState(null);
  const [latestLibrary, setLatestLibrary] = useState(null);
  const [latestWishlist, setLatestWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [started, finished, library, wishlist] = await Promise.all([
          supabase
            .from('library')
            .select('*')
            .not('start_reading', 'is', null)
            .order('start_reading', { ascending: false })
            .limit(1),

          supabase
            .from('library')
            .select('*')
            .not('end_reading', 'is', null)
            .order('end_reading', { ascending: false })
            .limit(1),

          supabase
            .from('library')
            .select('*')
            .eq('in_library', true)
            .order('in_library_from', { ascending: false })
            .limit(1),

          supabase
            .from('library')
            .select('*')
            .is('off_wishlist', null)
            .order('on_wishlist', { ascending: false })
            .limit(1)
        ]);

        if (started.error || finished.error || library.error || wishlist.error) {
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
	'reading': readingIcon,
	'finished': finishedIcon,
	'library': libraryIcon,
	'wishlist': wishlistIcon
  };

  const renderBook = (book, type, labelText) => {
    if (!book) return null;
  
    const icon = labelIcons[type];
  
    return (
      <div className="library-book-container">
        <div className="library-book-block-label">
          {icon && <img src={icon} alt={`${type} icon`} className="library-book-block-label-icon" />}{" "}
          {labelText}
        </div>
        <div className="library-book-block">
          <div className="library-book-block-content">
            <div className="library-book-block-title">{book.title}</div>
            <div className="library-book-block-author">{book.author}</div>
            <div className="library-book-block-genre">
                {book.is_fiction ? "Fictie" : "Non-fictie"}
            </div>
            <div className="library-book-block-date-more">
              <div className="library-book-block-date">
                Date: 2025-01-01
              </div>
              <div className="library-book-container-more">
                <Link to={`/book-details/${book.id}`}>
                  <span>see more</span>
                  <img src={moreIcon} alt="More" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };  

  return (
	<div>
	  {renderBook(latestStarted, 'reading', 'Currently reading')}
	  {renderBook(latestFinished, 'finished', 'Most recently finished')}
	  {renderBook(latestLibrary, 'library', 'Most recent addition')}
	  {renderBook(latestWishlist, 'wishlist', 'Most recently added to wishlist')}
	</div>
  );
}

export default Library;
