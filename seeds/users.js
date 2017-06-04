exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({
          id: 99901,
          name: 'Ambitious Aardvark',
          email: 'aardvark@example.org',
          twitter_id: 'alice'
        }),
        knex('users').insert({
          id: 99902,
          name: 'Bamboozled Baboon',
          email: 'baboon@example.org',
          twitter_id: 'bob'
        }),
      ]);
    });
};
