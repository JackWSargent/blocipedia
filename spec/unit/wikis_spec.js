const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
describe("wiki", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "jackw@bloc.io",
        password: "dsanfusnfua124",
        username: "user64"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          name: "Wiki1",
          body: "This is a wiki that is filled with knowledge",
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
      })
    });
  });
      describe("#create()", () => {
        it("should create a wiki object with a name and a body", (done) => {
          Wiki.create({
            name: "Wiki for the wild ones",
            body: "Wild people do wild things ya know"
          })
          .then((wiki) => {
            expect(wiki.name).toBe("Wiki for the wild ones");
            expect(wiki.body).toBe("Wild people do wild things ya know");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
        it("should not create a wiki with missing body of the wiki", (done) => {
            Wiki.create({
              name: "Wiki for the wild ones"
            })
            .then((wiki) => {
              done();
            })
            .catch((err) => {
              expect(err.message).toContain("Wiki.body cannot be null");
              done();
            })
          });
      });
})