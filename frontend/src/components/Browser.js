import { Component } from "react";
import { useParams } from "react-router-dom";
import { fetchElements } from "../api/FetchElements";
import { API_URL } from "../api/utils/config";
import BrowseElement from "./BrowserElement";
import ImageBox from "./ImageBox";
import Loading from "./Loading";
import { SelectedTags } from "./SelectedTags";
import { TagSearch } from "./TagSearch";
import { TagSelector } from "./TagSelector";

class Browser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      elements: null,
      elementsImages: null,
      displayImageBox: false,
      displaySearchBar: false,
      indexInBox: null,
      actualDirectory: [],
      folderParam: props.folder ? props.folder : "root",
    };

    this.getElements("parent", this.state.folderParam);
  }

  goHomeDirectory = () => {
    this.getElements("parent");

    this.setState({
      actualDirectory: [],
    });
  };

  goBackDirectory = () => {
    let directory = this.state.actualDirectory;
    directory.pop();

    this.getElements(
      "parent",
      this.state.actualDirectory[this.state.actualDirectory.length - 1]
    );

    // cause func getElements will add again, we delete actual dir too
    directory.pop();

    this.setState({
      actualDirectory: directory,
    });
  };

  async getElements(filter_field, filter_value = "root") {
    this.setState({ loading: true });
    let elements = await fetchElements(filter_field, filter_value);

    let elementsImages = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].is_file) {
        let image_path = API_URL.slice(0, -1) + elements[i].image.image_path;
        elementsImages.push(image_path);
      }
    }

    let directory = this.state.actualDirectory;
    if (elements[0]) {
      directory.push(elements[0].parent);
    }

    this.setState({
      elements: elements,
      elementsImages: elementsImages,
      actualDirectory: directory,
      loading: false,
    });
  }

  handleFolderClick = (elementName) => {
    this.getElements("parent", elementName);
  };

  handleFileClick = (element) => {
    this.setState({
      indexInView: this.state.elements.indexOf(element),
      displayImageBox: true,
    });
  };

  handleImageBoxClick = () => {
    this.setState({ displayImageBox: !this.state.displayImageBox });
  };

  render() {
    return (
      <div className="main-container page-top-margin">
        <div className="sub-container">
          <div className="main-browser__directory-path">
            <button className="button-browser" onClick={this.goBackDirectory}>
              <i className="fa fa-2x fa-arrow-left"></i>
            </button>
            <button className="button-browser" onClick={this.goHomeDirectory}>
              <i className="fa fa-2x fa-home"></i>
            </button>
            <button
              className="button-browser"
              onClick={() =>
                this.setState({
                  displaySearchBar: !this.state.displaySearchBar,
                })
              }
            >
              <i className="fa fa-2x fa-search"></i>
            </button>
            {this.state.displaySearchBar ? (
              <TagSearch />
            ) : (
              <span>{this.state.actualDirectory.join("/")}</span>
            )}
          </div>
          <div className="main-browser">
            {this.state.displayImageBox && (
              <ImageBox
                imagesName={this.state.elements}
                imagesInBox={this.state.elementsImages}
                indexInBox={this.state.indexInView}
                handleImageBoxClick={this.handleImageBoxClick}
                autofocus={true}
              />
            )}

            {!this.state.loading &&
              this.state.elements &&
              this.state.elements.map((element) => {
                return (
                  <BrowseElement
                    element={element}
                    handleFolderClick={this.handleFolderClick}
                    handleFileClick={this.handleFileClick}
                  />
                );
              })}
            {this.state.elements &&
              !this.state.loading &&
              this.state.elements.length == 0 && (
                <p className="main-browser__no-results">
                  {" "}
                  "¯\_(ツ)_/¯" No results
                </p>
              )}
            {this.state.loading && <Loading />}
          </div>
        </div>
      </div>
    );
  }
}

export default Browser;
