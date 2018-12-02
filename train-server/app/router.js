'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/train/list', controller.train.list);
  router.post('/api/train', controller.train.add);
  router.put('/api/train', controller.train.update);
  router.delete('/api/train', controller.train.delete);
  router.get('/api/dict/type', controller.dict.type);
  router.post('/api/user/login', controller.user.login);
};
