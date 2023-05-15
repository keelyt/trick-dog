import { RestSerializer } from 'miragejs';

import type { CardTagsResponse, TagData, TagsResponse } from '../../types';
import type { TagsObject } from '../types';

export const tagSerializer = RestSerializer.extend({
  serialize(_object, request: Request): TagsResponse | CardTagsResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    const json: TagsObject = RestSerializer.prototype.serialize.apply(this, arguments);

    if (request.url.includes('cards')) {
      return {
        tags: json.tags.map((tag) => Number(tag.id)),
      };
    }

    return {
      tags: json.tags.map(
        (tag): TagData => ({
          id: Number(tag.id),
          tagName: tag.tagName,
          deckId: Number(tag.deck),
        })
      ),
    };
  },
});
