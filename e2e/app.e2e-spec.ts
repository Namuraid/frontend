import { NamuraidPage } from './app.po';

describe('namuraid App', () => {
  let page: NamuraidPage;

  beforeEach(() => {
    page = new NamuraidPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
