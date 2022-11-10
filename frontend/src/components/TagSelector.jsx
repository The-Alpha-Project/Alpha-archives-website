import { useState } from "react";
import { TagDropDown } from "./TagDropDown";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRef } from "react";
import { searchTagsByKeywords } from "../utils/search";

export const TagSelector = ({ tags, handleTagClick }) => {
  const [displayTagDropDown, setDisplayTagDropDown] = useState();
  const wrapperRef = useRef(null);
  useOutsideBox(wrapperRef);

  const [searchKeywords, setSearchKeywords] = useState("");
  const [filteredTags, setFilteredTags] = useState(tags);
  console.log("FILTERED TAGS", filteredTags);

  const handleSearchInputChange = (e) => {
    const newValue = e.target.value;

    if (newValue === "") {
      setFilteredTags(tags);
      return;
    }

    setSearchKeywords(newValue);
    const resultsTags = searchTagsByKeywords(newValue, tags);
    setFilteredTags(resultsTags);
  };

  function useOutsideBox(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDisplayTagDropDown(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div ref={wrapperRef} className="tag-selector">
      <div className="tag-selector__search">
        <form action="">
          <div className="tag-selector__icon">#</div>
          <input
            className="tag-selector__search__bar"
            type="text"
            autoFocus={true}
            placeholder="Search and select tags"
            onFocus={() => {
              setDisplayTagDropDown(true);
            }}
            onChange={handleSearchInputChange}
          />
        </form>
        {displayTagDropDown && (
          <TagDropDown tags={filteredTags} handleTagClick={handleTagClick} />
        )}
      </div>
    </div>
  );
};

TagSelector.propTypes = {
  tags: PropTypes.array.isRequired,
  handleTagClick: PropTypes.func.isRequired,
};
