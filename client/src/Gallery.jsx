/* global document, window */
/* eslint no-underscore-dangle: ["error", {"allowAfterThis": true}] */
/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }] */
/* eslint import/extensions: ["error", {"jsx": always, "css": always}] */
import React from 'react';
import axios from 'axios';
import gallery from './gallery.css';
import lightbox from './LightboxComponents/lightbox.css';
import GalleryImage from './GalleryImage.jsx';
import Lightbox from './LightboxComponents/Lightbox.jsx';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      selected: 1,
      modal: false,
    };
    this.fetch = this.fetch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.keyFunc = this.keyFunc.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    document.addEventListener('keydown', this.keyFunc);
    this._isMounted && this.fetch();
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener('keydown', this.keyFunc);
  }

  fetch() {
    const location = window.location.href.split('/')[3];
    axios.get(`/api/images/${location}`)
      .then((data) => {
        this._isMounted && this.setState({ images: data.data });
      });
  }

  toggle(e) {
    const { modal } = this.state;
    let num = (e && e.target.id ? Number(e.target.id) : 1);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(num)) { num = 1; }
    this.setState({
      selected: num,
      modal: !modal,
    });
  }

  prev() {
    const { selected } = this.state;
    if (selected > 1) {
      const number = selected - 1;
      this.setState({
        selected: number,
      });
    }
  }

  next() {
    const { selected, images } = this.state;
    if (selected < images.length) {
      const number = selected + 1;
      this.setState({
        selected: number,
      });
    }
  }

  keyFunc(e) {
    const { modal, selected, images } = this.state;
    console.log(selected);
    if (modal === true) {
      if (e.keyCode === 27) {
        this.setState({
          modal: !modal,
        });
      } else if (e.keyCode === 39 && selected < images.length) {
        this.setState({
          selected: selected + 1,
        });
      } else if (e.keyCode === 37 && selected > 1) {
        this.setState({
          selected: selected - 1,
        });
      }
    }
  }

  render() {
    const { images, selected, modal } = this.state;
    if (images.length === 0) {
      return null;
    }
    const batch = (images.length >= 5
      ? images.slice(0, 5)
      : images);

    return (
      <div>
        <div className={modal ? lightbox.modal : lightbox.off} id="lightbox">
          <Lightbox
            selected={selected}
            images={images}
            toggle={this.toggle}
            next={this.next}
            prev={this.prev}
          />
        </div>
        <div className={gallery.container}>
          <div className={gallery.flex}>
            <div role="presentation" className={gallery.grid} onClick={this.toggle} id="gallery-grid">
              {batch.map((image) => (
                <GalleryImage
                  image={image}
                  length={batch.length}
                  key={image.id}
                />
              ))}
              {images.length
                ? <button type="submit" className={gallery.showAll}>Show all photos</button>
                : (<div> </div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
