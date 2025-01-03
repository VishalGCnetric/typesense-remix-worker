import { useConnector } from "react-instantsearch";
import { connectRatingMenu } from "instantsearch.js/es/connectors";
import PropTypes from 'prop-types'; // Import PropTypes

import { cx } from "../../utils/format";

export function Ratings({ attribute }) {
  const { refine, items, createURL } = useConnector(
    connectRatingMenu,
    { attribute },
    { $$widgetType: "e-commerce.ratingMenu" }
  );

  return (
    <div className="ais-RatingMenu">
      <ul className="ais-RatingMenu-list">
        {items.map((rating) => {
          return (
            <li
              className={cx(
                "ais-RatingMenu-item",
                rating.isRefined && "ais-RatingMenu-item--selected",
                rating.count === 0 && "ais-RatingMenu-item--disabled"
              )}
              key={rating.value}
            >
              <a
                className="ais-RatingMenu-link"
                aria-label={`${rating.value} & up`}
                href={createURL(rating.value)}
                onClick={(event) => {
                  event.preventDefault();
                  refine(rating.value);
                }}
              >
                {rating.stars.map((isStarFull, starIndex) => {
                  return (
                    <svg
                      key={starIndex}
                      className={cx(
                        "ais-RatingMenu-starIcon",
                        isStarFull
                          ? "ais-RatingMenu-starIcon--full"
                          : "ais-RatingMenu-starIcon--empty"
                      )}
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      width="20" // Adjust width as needed
                      height="20" // Adjust height as needed
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.472 5.008L16 5.816l-4 3.896.944 5.504L8 12.616l-4.944 2.6L4 9.712 0 5.816l5.528-.808L8 0z"
                      />
                    </svg>
                  );
                })}
                <span className="ais-RatingMenu-count">{rating.count}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
// Define prop types for Ratings
Ratings.propTypes = {
  attribute: PropTypes.string.isRequired,
};
