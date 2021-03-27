import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
todoInput: By = By.css(`input.new-todo`);
// this locator will find ALL the todos
 todos: By = By.css(`li.todo`);
// this locator will find the text of a todo FROM the todo
 todoLabel: By = By.css(`label`);
// this locator will find the checkbox for the todo FROM the todo
 todoComplete: By = By.css(`input`);
// this locator is for the "Clear complete" button in the corner
 clearCompletedButton: By = By.css("button.clear-completed");
 // this locator will toggle the star button on a todo
 todoStar: By = By.className("star");
 // this locator will identify todos that are starred
 starBanner: By = By.className("starred");
// 
todoCount: By = By.className("todo-count");

driver: WebDriver;

//If my page is always at a specific URL, I like to define it
url: string = "https://devmountain.github.io/qa_todos/";

//even though there are no methods on this page object, adding the driver in
//is a good habit to have
constructor(driver: WebDriver) {
  this.driver = driver;
  }
};
const tp = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  });
  afterAll(async () => {
    await driver.quit();
  });
  it("can add a todo", async () => {
    //copied this from firstTest.test.ts
    await driver.wait(until.elementLocated(tp.todoInput));
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
  });
  it("can remove a todo", async () => {
    //copied this from firstTest.test.ts
    let myTodos = await driver.findElements(tp.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.clearCompletedButton)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test To-Do";
    });
    expect(myTodo.length).toEqual(0);
  });
  it("can mark a todo with a star", async () => {
    //This test starts out like adding/removing; we add a todo, then find it and
    //do something; in this case, we click the "star"
    //
    //In order to know whether the star worked or not, we'll just count all the
    //starred todos at the start, and again at the end.
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingStars = await (await driver.findElements(tp.starBanner)).length;

    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
    await (await driver.findElements(tp.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(tp.todoStar)
      .click();
    let endingStars = await (await driver.findElements(tp.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("has the right number of todos listed", async () => {
    // this test will add a number of todos, make sure that the total count
    // went up as would be expected, and that the count listed at the end is
    // correct.
    await driver.wait(until.elementLocated(tp.todoInput));

    let startingTodoCount = await (await driver.findElements(tp.todos)).length;

    // adding 5 todos here
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 1\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 2\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 3\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 4\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 5\n");

    let endingTodoCount = await (await driver.findElements(tp.todos)).length;

    let message = await (await driver.findElement(tp.todoCount)).getText();

    expect(endingTodoCount - startingTodoCount).toBe(5);
    expect(message).toBe(`${endingTodoCount} items left`);
  });
});