class LayoutService {
  public screenWidth = 0;

  public screenHeight = 0;

  public setViewport(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
  }
}

export default new LayoutService();
