describe("Navigate to Blog Page", () => {
  it('finds the blog button"', () => {
    cy.visit("/");

    cy.contains("Blog").click();

    cy.url().should("include", "/blog");
  });
});

describe("Navigate to Blog Post", () => {
  it('finds the blog page"', () => {
    cy.visit("/");

    cy.contains("Blog").click();

    cy.url().should("include", "/blog");

    cy.contains("Contributing to a Compiler").click();

    cy.url().should("include", "/blog/contributing-to-a-compiler");
  });
});

describe("Navigate to Projects Page", () => {
  it('finds the projects button"', () => {
    cy.visit("/");

    cy.contains("Projects").click();

    cy.url().should("include", "/projects");
  });
});

describe("Navigate to a GitHub Project", () => {
  it('finds a project"', () => {
    cy.visit("/");

    cy.contains("Projects").click();

    cy.url().should("include", "/projects");

    cy.contains("a", "protoc-gen-camel")
      .invoke("attr", "href")
      .should("eq", "https://github.com/cobbinma/protoc-gen-camel");
  });
});
