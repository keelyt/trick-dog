import { RestSerializer } from 'miragejs';

import type { CardTagsResponse, TagData, TagResponse, TagsResponse } from '../../types';
import type { TagObject, TagsObject } from '../types';

export const tagSerializer = RestSerializer.extend({
  serialize(_object, request: Request): TagResponse | TagsResponse | CardTagsResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    // @ts-expect-error: following docs (https://miragejs.com/api/classes/serializer/#serialize)
    const json: TagObject | TagsObject = RestSerializer.prototype.serialize.apply(this, arguments);

    if (request.url.includes('cards') && 'tags' in json) {
      return {
        tags: json.tags.map((tag) => Number(tag.id)),
      };
    }

    if ('tag' in json) {
      return {
        tag: {
          id: Number(json.tag.id),
          tagName: json.tag.tagName,
          deckId: Number(json.tag.deck),
        },
      };
    }

    if ('tags' in json) {
      return {
        tags: json.tags
          .map(
            (tag): TagData => ({
              id: Number(tag.id),
              tagName: tag.tagName,
              deckId: Number(tag.deck),
            })
          )
          .sort((a, b) => {
            if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
            if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
            return 0;
          }),
      };
    }

    return json;
  },
});
