/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
    'use strict';
    const select = {
      bookTemplate: '#template-book',
      booksList: '.books-list',
      formInput: '.filters',
    };
    const templates = {
      books: Handlebars.compile(document.querySelector(select.bookTemplate).innerHTML),
    };
    const filters = [];
    class BooksList {
      constructor() {
        const thisBookList = this;
  
        thisBookList.initData();
        thisBookList.render();
        thisBookList.getElements();
        thisBookList.initActions();
      }
  
      initData() {
        this.data = dataSource.books;
      }
  
      getElements() {
        const thisBookList = this;
  
        thisBookList.booksContainer = document.querySelector(select.booksList);
        thisBookList.booksForm = document.querySelector(select.formInput);
  
      }
  
      render() {
        /* FUNCTION TO RENDER BOOKS AT PAGE */
        const thisBookList = this;
  
        for (let book of this.data) {
  
          const ratingBgc = thisBookList.determinateRatingBgc(book.rating);
          const ratingWidth = 10 * ratingBgc;
          book.ratingBgc = ratingBgc;
          book.ratingWidth = ratingWidth;
  
          // Generate HTML based on HandleBars Template
          const generatedHTML = templates.books(book);
  
          // Create DOM using utils.createElementFromHTML
          const generatedDOM = utils.createDOMFromHTML(generatedHTML);
  
          // Adding element to list .books-list
          const booksContainer = document.querySelector(select.booksList);
          booksContainer.appendChild(generatedDOM);
        }
      }
  
      initActions() {
  
        const thisBookList = this;
        const favoriteBooks = [];
        // Prevent the default behavior of single click on <a> tag
        thisBookList.booksContainer.addEventListener('click', function (event) {
          event.preventDefault();
        });
        // Adding books to favourite by double click
        thisBookList.booksContainer.addEventListener('dblclick', function (event) {
          event.preventDefault();
          // return parent element of the element that triggered the event.target and get it data-id attribute
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (!favoriteBooks.includes(bookId)) {
            // add parent element class favorite
            event.target.offsetParent.classList.add('favorite');
            favoriteBooks.push(bookId);
          } else {
            // remove parent element class favorite
            event.target.offsetParent.classList.remove('favorite');
            favoriteBooks.pop(bookId);
          }
          //console.log(favoriteBooks);
        });
        thisBookList.booksForm.addEventListener('click', function (event) {
          //event.preventDefault();
          const filter = event.target;
          // create const to know if checkbox is checked to return true/false
          const checked = filter.checked;
          if (filter.tagName === 'INPUT' && filter.type === 'checkbox' && filter.name == 'filter') {
            //console.log(filter.value);
            if (checked) {
              filters.push(filter.value);
            } else {
              filters.pop(filter.value);
            }
          }
          //console.log(filters);
          thisBookList.filterBooks();
        });
      }
  
      filterBooks() {
        for (let book of dataSource.books) {
          // Create variable that default is false
          let shouldBeHidden = false;
  
          // Create const to find element book
          const selectedBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
  
          // Create Loop to check if book detail contain fiter
          for (const filter of filters) {
            if (!book.details[filter]) {
              shouldBeHidden = true;
              break;
            }
          }
          // Adding / removing class "hidden" based on shouldBeHidden status
          if (shouldBeHidden == true) {
            selectedBook.classList.add('hidden');
          } else {
            selectedBook.classList.remove('hidden');
          }
        }
      }
  
      determinateRatingBgc(rating) {
        const thisBookList = this;
  
        thisBookList.ratingBgc = '';
        // Adding style based on rating
        if (rating < 6) {
          thisBookList.ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
        } else if (rating > 6 && rating <= 8) {
          thisBookList.ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
        } else if (rating > 8 && rating <= 9) {
          thisBookList.ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else if (rating > 9) {
          thisBookList.ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
        }
  
        return thisBookList.ratingBgc;
      }
  
    }
  
    const app = new BooksList();
    console.log(app);
  }