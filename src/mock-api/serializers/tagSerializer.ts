import { RestSerializer } from 'miragejs';

import type { TagsResponse } from '../../types';
import type { TagsObject } from '../types';

export const tagSerializer = RestSerializer.extend({
  serialize(): TagsResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    const json: TagsObject = RestSerializer.prototype.serialize.apply(this, arguments);

    if ('tags' in json) {
      return {
        tags: json.tags.map((tag) => ({
          id: Number(tag.id),
          tag_name: tag.tagName,
          deck_id: Number(tag.deck),
        })),
      };
    }

    return json;
  },
});
