import * as MonsterController from '../../../controllers/api/monsterController.js';

import { mockNext, mockRequest, mockResponse } from '../../support/requestHelpers.js';

import Monster from '../../../models/monster/index.js';
import mockingoose from 'mockingoose';

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'aboleth',
      name: 'Aboleth',
      url: '/api/monsters/aboleth',
    },
    {
      index: 'acolyte',
      name: 'Acolyte',
      url: '/api/monsters/acolyte',
    },
    {
      index: 'adult-black-dragon',
      name: 'Adult Black Dragon',
      url: '/api/monsters/adult-black-dragon',
    },
  ];
  const request = mockRequest({ query: {}, originalUrl: '/api/monsters' });

  it('returns a list of objects', async () => {
    mockingoose(Monster).toReturn(findDoc, 'find');

    await MonsterController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Monster).toReturn(error, 'find');

      await MonsterController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'aboleth',
    name: 'Aboleth',
    url: '/api/monsters/aboleth',
  };

  const showParams = { index: 'aboleth' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Monster).toReturn(findOneDoc, 'findOne');

    await MonsterController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Monster).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await MonsterController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Monster).toReturn(error, 'findOne');

      await MonsterController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
