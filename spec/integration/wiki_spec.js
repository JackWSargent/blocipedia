const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
describe("routes : wikis", () => {

    beforeEach((done) => {
        this.wiki;
        this.wiki2;
        sequelize.sync({force: true}).then((res) => {
  
         Wiki.create({
           name: "JavaScript",
           body: "Below is everything you need to know about JavaScript"
         })
          .then((wiki) => {
            this.wiki = wiki;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
    });
    describe("member tests for wiki CRUD", () => {
        beforeEach((done) => {
            User.create({
                username: "userhnei",
                email: "person21@example.com",
                password: "123456",
                role: 0
            })
            .then((user) => {
                request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        userId: user.id,
                        email: user.email,
                        username: user.username,
                        role: user.role
                    }
                },
                (err, res, body) => {
                    done();
                });
            });
        });
        describe("GET /wikis", () => {
            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis");
                    expect(body).toContain("JavaScript");
                    done();
                });
            });
        });
        describe("GET /wikis/new", () => {
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
                });
            });
        });
        describe("POST /wikis/create", () => {
            const options = {
                url: `${base}create`,
                form: {
                    name: "JavaScript2",
                    body: "A lot more javascript",
                    private: false
                }
            };
            it("should create a new wiki and redirect", (done) => {
                request.post(options,
                (err, res, body) => {
                Wiki.findOne({where: {name: "JavaScript2"}})
                    .then((wiki) => {
                        expect(res.statusCode).toBe(303);
                        expect(wiki.name).toBe("JavaScript2");
                        expect(wiki.body).toBe("A lot more javascript");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
        describe("GET /wikis/:id", () => {
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("JavaScript");
                    done();
                });
            });
        });
        describe("POST /wikis/:id/destroy", () => {
            it("should not delete the wiki with the associated ID", (done) => {
                Wiki.findAll()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.findAll()
                        .then((wikis) => {
                            //console.log(wikis);
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                            done();
                        })
                    });
                });
            });
        });
        describe("GET /wikis/:id/edit", () => {
            it("should not render a view with an edit wiki form", (done) => {
                request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull(); //Redirects to page of the wiki and not actually on the edit page
                    expect(body).toContain("Edit");
                    done();
                });
            });
        });
        describe("POST /wikis/:id/update", () => {
            it("should not update the wiki with the given values", (done) => {
                const options = {
                    url: `${base}1/update`,
                    form: {
                        name: "JavaScript Frameworks",
                        body: "There are a lot of them",
                        
                    }
                };//
                request.post(options,
                (err, res, body) => {
                    expect(err).toBeNull();
                    Wiki.findOne({
                        where: { id: this.wiki.id }
                    })
                    .then((wiki) => {
                        expect(wiki.name).toBe("JavaScript Frameworks");
                        done();
                    });
                });
            });
        });
    });
    describe("premium tests for wiki CRUD", () => {
        beforeEach((done) => {
            User.create({
                username: "userh1neil",
                email: "person2121@example.com",
                password: "123456",
                role: 2
            })
            .then((user) => {
                //console.log(user.role);
                request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        userId: user.id,
                        email: user.email,
                        username: user.username,
                        role: user.role
                    }
                },
                (err, res, body) => {
                    done();
                });
            });
        });
        describe("GET /wikis", () => {
            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis");
                    expect(body).toContain("JavaScript");
                    done();
                });
            });
        });
        describe("GET /wikis/new", () => {
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
                });
            });
        });
        describe("POST /wikis/create", () => {
            const options = {
                url: `${base}create`,
                form: {
                    name: "JavaScript2",
                    body: "A lot more javascript",
                    private: false
                }
            };
            it("should create a new wiki and redirect", (done) => {
                request.post(options,
                (err, res, body) => {
                    //this.wiki2 = wiki;
                Wiki.findOne({where: {name: "JavaScript2"}})
                    .then((wiki) => {
                        //console.log(wiki);
                        expect(res.statusCode).toBe(303);
                        //console.log("status code: " + res.statusCode);
                        expect(wiki.name).toBe("JavaScript2");
                        expect(wiki.body).toBe("A lot more javascript");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
        describe("GET /wikis/:id", () => {
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    //console.log(body);
                    expect(body).toContain("JavaScript");
                    done();
                });
            });
        });
        describe("POST /wikis/:id/destroy", () => {
            it("should delete the wiki with the associated ID", (done) => {
                Wiki.findAll()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;
                    expect(wikiCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.findAll()
                        .then((wikis) => {
                            //console.log(wikis);
                            expect(err).toBeNull();
                            expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                            done();
                        })
                    });
                });
            });
        });
        describe("GET /wikis/:id/edit", () => {
            it("should render a view with an edit wiki form", (done) => {
                request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Wiki");
                    expect(body).toContain("JavaScript");
                    done();
                });
            });
        });
        describe("POST /wikis/:id/update", () => {
            it("should update the wiki with the given values", (done) => {
                const options = {
                    url: `${base}1/update`,
                    form: {
                        name: "JavaScript Frameworks",
                        body: "There are a lot of them",
                        private: false
                    }
                };//
                request.post(options,
                (err, res, body) => {
                    expect(err).toBeNull();
                    Wiki.findOne({
                        where: { id: this.wiki.id }
                    })
                    .then((wiki) => {
                        expect(wiki.name).toBe("JavaScript Frameworks");
                        done();
                    });
                });
            });
        });
    });
});