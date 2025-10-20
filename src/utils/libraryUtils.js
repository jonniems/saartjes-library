export const isBookReadyToRead = (book) => {
  if (!book.in_library || book.start_reading) {
    return false;
  }

  const criteriaA = book.is_gift === true;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const inLibraryDate = book.in_library_from
    ? new Date(book.in_library_from)
    : null;

  const criteriaB = inLibraryDate && inLibraryDate < oneYearAgo;

  return criteriaA || criteriaB;
};

export const getRandomPickCriteria = () => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoISO = oneYearAgo.toISOString();

  const criteriaA = "is_gift.eq.true,in_library.eq.true,start_reading.is.null";

  const criteriaB = `in_library_from.lt.${oneYearAgoISO},in_library.eq.true,start_reading.is.null`;

  return `and(${criteriaA}),and(${criteriaB})`;
};
