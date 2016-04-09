import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.html';

Template.article.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Articles.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Articles.remove(this._id);
  },
});