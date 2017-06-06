'use strict';

/* Various helper accessing the DOM, which is hidden/hard to manipulate through
 * Angular itself. */
class ScreenHelper {

  /* Attempt to put the document in fullscreen */
  static requestFullScreen() {
    var i = document.body;
    if (i.requestFullscreen)
      i.requestFullscreen();
    else if (i.webkitRequestFullscreen)
      i.webkitRequestFullscreen();
    else if (i.mozRequestFullScreen)
      i.mozRequestFullScreen();
    else if (i.msRequestFullscreen)
      i.msRequestFullscreen();
  }

  /* resume 'normal' (i.e. windowed) browsing */
  static exitFullScreen() {
    if (document.exitFullscreen)
      document.exitFullscreen();
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if (document.msExitFullscreen)
      document.msExitFullscreen();
  }

  /* Return whether the current window is in full screen or not */
  static isFullScreen() {
    return document.fullscreenElement != null ||
	         document.webkitFullscreenElement != null ||
	         document.mozFullScreenElement != null ||
	         document.msFullscreenElement != null;
  }

  /* Switch between full screen and windowed */
  static toggleFullScreen() {
    if (ScreenHelper.isFullScreen())
      ScreenHelper.exitFullScreen();
    else
      ScreenHelper.requestFullScreen();
  }

  /* Compute the size of the browser viewport
   * :return: { 'width': number, 'height': number } */
  static windowSize() {
    /* https://www.w3schools.com/jsref/prop_win_innerheight.asp */
    return { 'width': window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth,
             'height': window.innerHeight ||
                       document.documentElement.clientHeight ||
                       document.body.clientHeight };
  }
};
