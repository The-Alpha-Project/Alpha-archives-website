import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { fetchApplyTag } from "../api/fetchApplyTag";
import { fetchRemoveApplyTag } from "../api/fetchRemoveApplyTag";
import { TagSelector } from "./TagSelector";
import { fetchCreateTag } from "../api/fetchCreateTag";
import { useSelector } from "react-redux";
import { getAuth } from "../store/features/auth/selectors";
import { Link } from "react-router-dom";
import { getRandomInt } from "../utils/misc";
export const TagContainer = ({
  fileTags,
  tags,
  file,
  createTagInState,
  updateFileInState,
  componentRef,
}) => {
  const [tagBoxIsOpen, setTagBoxIsOpen] = useState(false);
  const [newFileTags, setNewFileTags] = useState(fileTags ? fileTags : []);
  const [tagBoxIsLoading, setTagBoxIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const auth = useSelector(getAuth);

  useOutsideBox(wrapperRef);

  useEffect(() => {
    setNewFileTags(fileTags);
  }, [fileTags]);

  function useOutsideBox(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setTagBoxIsOpen(false);
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

  const handleCreateTagClick = async (searchKeywords) => {
    if (!searchKeywords) {
      return;
    }

    setTagBoxIsLoading(true);
    const response = await fetchCreateTag(searchKeywords);
    if (!response.error) {
      const newTag = response.body;
      createTagInState(newTag);
    }
    setTagBoxIsLoading(false);
  };

  const handleTagClick = async (tag) => {
    setTagBoxIsLoading(true);
    // we set the focus on imageBox to be able to use next/prev arrows after a tag click
    componentRef.current.focus();
    if (newFileTags.some((item) => item?.tag === tag)) {
      // const response = await fetchRemoveApplyTag(tag);
      const updatedFileTags = newFileTags;

      // Tag is already applied, we remove it
      for (let tagApplied of newFileTags) {
        if (tagApplied?.tag === tag) {
          await fetchRemoveApplyTag(tagApplied);
          const index = newFileTags.indexOf(tagApplied);
          updatedFileTags.splice(index, 1);
          setNewFileTags([...updatedFileTags]);
          setTagBoxIsLoading(false);
          return;
        }
      }
    }

    // We apply tag
    const response = await fetchApplyTag(tag, file.image_hash);

    const createdTag = response.body;
    const newTags = [createdTag, ...newFileTags];
    const updatedFile = { ...file, tags: newTags };
    updateFileInState(updatedFile);
    setNewFileTags([createdTag, ...newFileTags]);
    setTagBoxIsLoading(false);
  };

  return (
    <div className="tag-container" ref={wrapperRef}>
      <button
        onClick={() => setTagBoxIsOpen(!tagBoxIsOpen)}
        className="tag-container__selector"
      >
        <i
          className={
            tagBoxIsOpen
              ? "fa fa-angle-down tag-container__selector__icon--reverse"
              : "fa fa-angle-down"
          }
        ></i>
        Tags
      </button>
      <div className="tag-container__tags">
        {newFileTags?.map(
          (tag) =>
            tag && (
              <span
                key={`tag-container-${tag.tag}-${getRandomInt(10000)}`}
                className="tag-element"
              >
                {tag.tag}
              </span>
            )
        )}
      </div>
      {tagBoxIsOpen && (
        <div className="tag-container__box">
          {!auth.isStaff && (
            <div className="tag-container__box--restricted">
              <p>
                <Link to="/auth">login</Link> to add tags
              </p>
            </div>
          )}

          <TagSelector
            tags={tags}
            handleTagClick={handleTagClick}
            handleTagCreateClick={handleCreateTagClick}
            showOnFocus={false}
            fileTags={newFileTags}
            isLoading={tagBoxIsLoading}
            disabled={auth.isStaff ? false : true}
          />
        </div>
      )}
    </div>
  );
};

TagContainer.propTypes = {
  tags: PropTypes.array.isRequired,
  fileTags: PropTypes.array.isRequired,
  file: PropTypes.object.isRequired,
  createTagInState: PropTypes.func,
  updateTagInState: PropTypes.func,
  componentRef: PropTypes.object,
};
