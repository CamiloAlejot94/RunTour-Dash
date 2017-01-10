import { RunTourDashPage } from './app.po';

describe('run-tour-dash App', function() {
  let page: RunTourDashPage;

  beforeEach(() => {
    page = new RunTourDashPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
